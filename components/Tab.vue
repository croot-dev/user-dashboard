<template>
  <template v-if="'prepend' in props">
    <slot name="prepend">
      <span class="prepend">Empty Prepend</span>
    </slot>
  </template>
  <span class="title">
    {{ props.title }}
  </span>
  <template v-if="'append' in props">
    <slot name="append">
      <span class="append">Empty Append</span>
    </slot>
  </template>
</template>
<script setup lang="ts">
import { Widget } from '~/types';

const props = defineProps<{
    id: string;
    title: string;
    prepend?: string;
    append?: string;
    widgets: Widget<unknown>[]
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