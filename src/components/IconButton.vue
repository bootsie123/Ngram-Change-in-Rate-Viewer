<template>
  <span class="icon" :class="{ round }" @mouseover="hover = true" @mouseleave="hover = false" @click="$emit('click')">
    <i :class="icon" />
  </span>
</template>

<script>
  export default {
    name: "IconButton",
    props: {
      icon: {
        type: String,
        required: true
      },
      round: Boolean
    },
    emits: ["click"],
    data() {
      return {
        hover: false
      };
    }
  };
</script>

<style lang="scss" scoped>
  .round {
    border-radius: 50%;
  }

  .icon {
    color: #dbdbdb;
  }

  .icon:hover {
    color: #4a4a4a;
    cursor: pointer !important;
  }
</style>
