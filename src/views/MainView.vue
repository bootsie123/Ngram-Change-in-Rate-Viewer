<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-1 has-text-weight-bold">Ngram Change in Rate</h1>
        <SearchBar
          v-model:tags="searchParams.tags"
          v-model:corpus="searchParams.corpus"
          v-model:startYear="searchParams.startYear"
          v-model:endYear="searchParams.endYear"
          v-model:showGradient="graphOptions.showGradient"
          v-model:showSideBySide="graphOptions.showSideBySide"
        />
        <Chart :data="searchParams" :graphOptions="graphOptions" />
      </div>
    </div>
  </section>
</template>

<script>
  import SearchBar from "@/components/SearchBar";
  import Chart from "@/components/Chart";

  export default {
    name: "MainView",
    components: {
      SearchBar,
      Chart
    },
    data() {
      return {
        searchParams: {
          tags: [],
          corpus: 26,
          startYear: 1500,
          endYear: 2019
        },
        graphOptions: {
          showGradient: false,
          showSideBySide: false
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  .hero {
    background-color: #f7f9fd;
  }

  .title {
    margin-bottom: 4rem !important;
  }
</style>
