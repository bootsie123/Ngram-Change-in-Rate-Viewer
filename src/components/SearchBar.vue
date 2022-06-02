<template>
  <div>
    <div class="searchBar field has-addons has-addons-centered">
      <div class="control is-expanded">
        <VueTagsInput
          v-model="tag"
          placeholder="Search Words"
          :allow-edit-tags="true"
          :tags="modifiedTags"
          :separators="[' ', ';', ',']"
          @tags-changed="
            $emit(
              'update:tags',
              $event.map(tag => tag.text)
            )
          "
        />
      </div>
      <div class="control">
        <DropdownSearch
          class="is-medium"
          :modelValue="{ name: startYear, value: startYear }"
          @update:modelValue="$emit('update:startYear', $event.value)"
          :options="years"
          placeholder="Start"
          searchPlaceholder="Start Year"
        />
      </div>
      <div class="control">
        <DropdownSearch
          class="is-medium"
          :modelValue="{ name: endYear, value: endYear }"
          @update:modelValue="$emit('update:endYear', $event.value)"
          :options="years"
          placeholder="End"
          searchPlaceholder="End Year"
        />
      </div>
      <div class="control">
        <DropdownSearch
          class="is-medium"
          :modelValue="modifiedSmoothing"
          @update:modelValue="$emit('update:smoothing', $event.value)"
          :options="smoothingOptions"
          placeholder="Smoothing"
        />
      </div>
      <div class="control">
        <DropdownSearch
          class="is-medium"
          :modelValue="modifiedCorpus"
          @update:modelValue="$emit('update:corpus', $event.value)"
          :options="corpuses"
          placeholder="Corpus"
        />
      </div>
    </div>
    <div class="searchBar addition">
      <label class="checkbox">
        <input :checked="showGradient" @change="$emit('update:showGradient', $event.target.checked)" type="checkbox" />
        Derivative
      </label>
      <label class="checkbox">
        <input
          :checked="showSideBySide"
          @change="$emit('update:showSideBySide', $event.target.checked)"
          type="checkbox"
        />
        Side By Side
      </label>
    </div>
  </div>
</template>

<script>
  import VueTagsInput from "@sipec/vue3-tags-input";
  import DropdownSearch from "@/components/DropdownSearch";

  import ngram from "@/lib/ngram";

  export default {
    name: "SearchBar",
    components: {
      DropdownSearch,
      VueTagsInput
    },
    props: {
      tags: Array,
      startYear: Number,
      endYear: Number,
      corpus: Number,
      smoothing: Number,
      showGradient: Boolean,
      showSideBySide: Boolean
    },
    emits: [
      "update:tags",
      "update:startYear",
      "update:endYear",
      "update:corpus",
      "update:smoothing",
      "update:showGradient",
      "update:showSideBySide"
    ],
    data() {
      return {
        corpuses: [],
        years: [],
        tag: ""
      };
    },
    computed: {
      modifiedCorpus() {
        return this.corpuses.find(corpus => corpus.value === this.corpus) || {};
      },
      modifiedTags() {
        return this.tags.map(tag => {
          return { text: tag, tiClasses: ["ti-valid"] };
        });
      },
      modifiedSmoothing() {
        return { name: this.smoothing.toString(), value: this.smoothing };
      },
      smoothingOptions() {
        const options = [];

        for (let i = 0; i <= 50; i++) {
          options.push({
            name: i.toString(),
            value: i
          });
        }

        return options;
      }
    },
    methods: {
      getYears(start, end) {
        const years = [];

        for (let i = start; i <= end; i++) {
          years.push({
            name: i.toString(),
            value: i
          });
        }

        return years;
      }
    },
    async created() {
      this.years = this.getYears(1500, 2019);

      const res = await ngram.getCorpuses();

      if (res.status === 200) {
        this.corpuses = res.data.corpuses.map(corpus => {
          return {
            name: `${corpus.name} (${corpus.year})`,
            value: Number(corpus.value)
          };
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .searchBar {
    display: inline-flex !important;
    box-shadow: 0px 5px 12px 0px #0000001a;
    border-radius: 9999px;
  }

  ::v-deep(.ti-input),
  ::v-deep(.ti-new-tag-input),
  ::v-deep(.control button) {
    border: none !important;
    box-shadow: none !important;
  }

  .searchBar .control {
    background: white;
  }

  .searchBar .control:first-child {
    border-radius: 9999px 0 0 9999px !important;
  }

  .searchBar .control:last-child {
    border-radius: 0 9999px 9999px 0 !important;
  }

  ::v-deep(.searchBar .control:last-child button) {
    background: none !important;
  }

  .searchBar .control:focus-within::after {
    position: absolute;
    bottom: -1px;
    left: 0;
    height: 1px;
    width: 100%;
    background: #4a4a4a;
    content: "";
  }

  .searchBar .control:first-of-type:focus-within::after,
  .searchBar .control:last-of-type:focus-within::after {
    width: calc(100% - 1.25rem);
  }

  .searchBar .control:first-of-type:focus-within::after {
    right: 0;
    left: unset;
  }

  ::v-deep(.ti-new-tag-input) {
    @include input;
    width: 150px !important;
  }

  ::v-deep(.vue-tags-input),
  ::v-deep(.ti-input),
  ::v-deep(.ti-new-tag-input) {
    height: 100% !important;
    margin: 0 !important;
  }

  ::v-deep(.ti-new-tag-input-wrapper) {
    margin: 0 !important;
  }

  ::v-deep(.vue-tags-input) {
    max-width: none !important;
    padding: calc(0.5em - 1px) calc(calc(0.75em - 1px) + 0.375em) !important;
    border-radius: 9999px 0 0 9999px !important;
  }

  ::v-deep(.ti-actions) {
    margin-top: 0.2em !important;
  }

  ::v-deep(.ti-tag) {
    padding: 3px 7px !important;
    background: $info !important;
    border-radius: 9999px !important;
  }

  ::v-deep(.ti-deletion-mark) {
    background-color: $danger !important;
  }

  .addition {
    height: 2.5em;
    margin-left: 2em;
    margin-bottom: 0.75rem;
    vertical-align: top;
    font-size: 1.25rem;
    background: white;
  }

  .addition .checkbox {
    margin: auto;
    padding: 0 1em;
    line-height: 1.5;
  }

  .addition .checkbox:first-of-type {
    padding: 0 0.5em 0 1em;
  }

  .addition .checkbox:last-of-type {
    padding: 0 1em 0 0.5em;
  }
</style>
