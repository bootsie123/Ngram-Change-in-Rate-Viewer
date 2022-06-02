<template>
  <div class="chart">
    <Spinner v-if="loading" />
    <div class="canvas" v-else-if="Object.keys(dataSource.data).length > 0">
      <FusionCharts type="timeseries" width="100%" height="600" dataFormat="json" :dataSource="dataSource">
      </FusionCharts>
      <div class="hidden"></div>
    </div>
  </div>
</template>

<script>
  import FusionCharts from "fusioncharts";

  import VueFusionChartsComponent from "vue-fusioncharts/component";
  import TimeSeries from "fusioncharts/fusioncharts.timeseries";

  import Spinner from "@/components/Spinner";

  import ngram from "@/lib/ngram";
  import calc from "@/lib/calc";

  export default {
    name: "Chart", //eslint-disable-line vue/multi-word-component-names
    props: {
      data: Object,
      graphOptions: {
        type: Object,
        default() {
          return {
            showGradient: false,
            showSideBySide: false
          };
        }
      }
    },
    components: {
      Spinner,
      FusionCharts: VueFusionChartsComponent(FusionCharts, TimeSeries)
    },
    data() {
      return {
        loading: false,
        dataSource: {
          data: {},
          caption: {
            text: "Google's Ngram"
          },
          subcaption: {
            text: "Change in word frequency over time"
          },
          series: "word",
          xAxis: {
            binning: {
              year: [1],
              month: [],
              day: [],
              hour: [],
              minute: [],
              second: [],
              millisecond: []
            }
          },
          yAxis: [
            {
              plot: "frequency",
              title: "Frequency",
              format: {
                round: 4,
                suffix: "%"
              }
            }
          ],
          legend: {
            position: "right"
          },
          tooltip: {
            outputTimeFormat: {
              year: "%Y"
            }
          },
          extensions: {
            customRangeSelector: {
              enabled: 0
            }
          }
        },
        schema: [
          {
            name: "time",
            type: "date"
          },
          {
            name: "word",
            type: "string"
          },
          {
            name: "frequency",
            type: "number"
          }
        ]
      };
    },
    watch: {
      data: {
        handler(newValue) {
          if (newValue.tags.length > 0) {
            this.loading = true;

            this.updateData();
          } else {
            this.dataSource.data = {};
          }
        },
        deep: true
      },
      graphOptions: {
        handler() {
          if (this.data.tags.length > 0) {
            this.updateData();
          }
        },
        deep: true
      }
    },
    methods: {
      async updateData() {
        const res = await ngram.getData(
          this.data.tags.join(","),
          this.data.startYear,
          this.data.endYear,
          this.data.corpus,
          this.data.smoothing
        );

        if (res.status === 200) {
          const data = [];

          for (let index in res.data.data) {
            const word = res.data.data[index];

            if (this.graphOptions.showSideBySide || !this.graphOptions.showGradient) {
              for (let index in word.timeseries) {
                data.push(["1/1/" + (this.data.startYear + Number(index)), word.ngram, word.timeseries[index] * 100]);
              }
            }

            if (this.graphOptions.showGradient) {
              const gradient = calc.gradient(word.timeseries);

              for (let index in gradient) {
                data.push([
                  "1/1/" + (this.data.startYear + Number(index)),
                  `${word.ngram}<b>'</b>`,
                  gradient[index] * 100
                ]);
              }
            }
          }

          const fusionTable = new FusionCharts.DataStore().createDataTable(data, this.schema);

          this.dataSource.data = fusionTable;

          this.loading = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .chart {
    margin-top: 3rem;
  }

  .canvas {
    position: relative;
    padding: 1em;
    background: white;
    border-radius: 15px;
    box-shadow: 0px 0px 20px 0px #0000000f;
  }

  .hidden {
    position: absolute;
    height: calc(30px + 1em);
    width: calc(100% - 2em);
    bottom: 0;
    background: white;
  }
</style>
