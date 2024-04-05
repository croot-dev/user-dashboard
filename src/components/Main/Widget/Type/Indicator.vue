<template>
  <div
    class="widget"
    :style="{
      height: `${height}px`,
    }"
  >
    <h2>
      {{ maintext }}
    </h2>
    <span v-if="maintext">{{ caption }}</span>
  </div>
</template>

<script setup lang="ts">
import type { DatasetComponentOption } from 'echarts';
import { WIDGET_INDICATOR_CALCULATOR, type WIDGET_TYPE } from '~/constants';
import type { Widget } from '~/types';

const { dataSource, content } = defineProps<{
  title: string;
  height: number;
  dataSource: DatasetComponentOption['source'];
  content?: Widget.Content[typeof WIDGET_TYPE.INDICATOR];
}>();

const caption = computed(() => `${content?.calculator} of ${content?.column}`);
const maintext = computed(() => {
  if (!Array.isArray(dataSource)) {
    return '';
  }

  switch (content?.calculator) {
  case WIDGET_INDICATOR_CALCULATOR.SUM:
    return dataSource
      .map((item: any) => Number(item[content?.column]))
      .reduce((result, item) => result + item, 0);
  case WIDGET_INDICATOR_CALCULATOR.AVG:
    return (dataSource
      .map((item: any) => Number(item[content?.column]))
      .reduce((result, item) => result + item, 0)
    ) / dataSource.length;
  case WIDGET_INDICATOR_CALCULATOR.MIN:
    return Math.min.apply(
      Math,
      dataSource.map((item: any) => Number(item[content?.column]))
    );
  case WIDGET_INDICATOR_CALCULATOR.MAX:
    return Math.max.apply(
      Math,
      dataSource.map((item: any) => Number(item[content?.column]))
    );
  case WIDGET_INDICATOR_CALCULATOR.COUNT:
    return dataSource.length;
  }
});
</script>

<style lang="scss" scoped>
.widget {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
  text-align: center;

  h2 {}
  span {}
}
</style>
