<template>
  <template v-if="'prepend' in data">
    <slot name="prepend">
      <span class="prepend">Empty Prepend</span>
    </slot>
  </template>
  <span class="title">
    {{ data.title }}
  </span>
  <template v-if="'append' in data">
    <slot name="append">
      <span class="append">Empty Append</span>
    </slot>
  </template>
</template>
<script setup lang="ts">
const data = defineProps<{
  title: String;
  prepend?: String | Component;
  append?: String | Component;
}>();
</script>
<style lang="scss" scoped>
.prepend,
.append {
  font-size: 0.8em;
}
.title {
  font-size: 1.2em;
  font-weight: 700;
}
</style>