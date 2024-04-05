<template>
  <v-data-table-virtual
    :items="dataSource"
    density="compact"
    :height="height"
  >
    <template #bottom />
  </v-data-table-virtual>
</template>
<script setup lang="ts">
import type { VDataTable } from 'vuetify/lib/components/index.mjs';

import type { WIDGET_TYPE } from '~/constants';
import type { Widget } from '~/types';

withDefaults(defineProps<{
  title: string;
  width: number;
  height: number;
  dataSource: typeof VDataTable['items']
  content?: Widget.Content[typeof WIDGET_TYPE.LIST] | void;
}>(), {
  title: 'Undefined',
  width: 240,
  height: 240,
  content: undefined
});

</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>
