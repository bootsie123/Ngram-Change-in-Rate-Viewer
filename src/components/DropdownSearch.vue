<template>
  <div class="dropdown" :class="{ 'is-active': dropdownActive }">
    <div class="dropdown-trigger">
      <button class="button" :class="$attrs.class" @click="toggleActive">
        <span>{{ modelValue.name || placeholder }}</span>
        <span class="icon is-small">
          <i :class="dropdownActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu">
      <div class="dropdown-content">
        <div class="search dropdown-item">
          <div class="control has-icons-left">
            <input class="input" type="text" v-model.trim="filter" :placeholder="searchPlaceholder || placeholder" />
            <span class="icon is-small is-left">
              <i class="ri-search-line"></i>
            </span>
          </div>
          <IconButton
            class="is-small is-right"
            icon="ri-close-line"
            @click="
              () => {
                filter = '';
              }
            "
          />
        </div>
        <hr class="dropdown-divider" />
        <div class="holder">
          <a
            class="dropdown-item has-text-left"
            v-for="option in filteredOptions"
            :key="option"
            @click="$emit('update:modelValue', option)"
          >
            {{ option.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IconButton from "@/components/IconButton";

  export default {
    name: "DropdownSearch",
    props: {
      modelValue: {
        type: Object,
        required: true
      },
      options: {
        type: Object,
        required: true
      },
      placeholder: String,
      searchPlaceholder: String
    },
    emits: ["update:modelValue"],
    components: {
      IconButton
    },
    data() {
      return {
        dropdownActive: false,
        filter: ""
      };
    },
    computed: {
      filteredOptions() {
        return this.options.filter(option => option.name.toLowerCase().includes(this.filter.toLowerCase()));
      }
    },
    methods: {
      toggleActive() {
        this.dropdownActive = !this.dropdownActive;
      },
      closeDropdown(e) {
        if (!this.$el.contains(e.target)) {
          this.dropdownActive = false;
        }
      }
    },
    mounted() {
      document.addEventListener("click", this.closeDropdown);
    },
    beforeUnmount() {
      document.removeEventListener("click", this.closeDropdown);
    }
  };
</script>

<style lang="scss" scoped>
  .input {
    border: none;
    box-shadow: none !important;
  }

  .dropdown-content > .dropdown-item {
    padding: 0;
  }

  .dropdown-content {
    padding-bottom: 0;
  }

  .holder {
    padding-bottom: 0.25rem;
    max-height: 200px;
    overflow-y: scroll;
  }

  .search {
    display: flex;
    align-items: center;
  }

  .search .icon {
    padding: 1rem;
  }

  .search .input {
    padding-right: 0;
  }
</style>
