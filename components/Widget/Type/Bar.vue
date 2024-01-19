<template>
  <div class="widget" :style="{ height: height+'px' }">
    <v-chart
      class="chart"
      :option="option"
    />
  </div>
</template>
<script setup lang="ts">
import VChart from 'vue-echarts';
import type { DatasetComponentOption, EChartsOption, BarSeriesOption } from 'echarts';
import type { Widget } from '~/types';
import type { WIDGET_TYPE } from '~/constants';

const { dataSource, content } = defineProps<{
  title: string;
  width: number;
  height: number;
  dataSource: DatasetComponentOption['source'];
  chartOption?: BarSeriesOption[];
  content?: Widget.Content[typeof WIDGET_TYPE.BAR];
}>();

const option = reactive<EChartsOption>({
  grid: {
    left: 30,
    right: 10,
    bottom: 30,
    top: 30
  },
  dataset: [],
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  tooltip: { show: true },
  legend: { show: true, type: 'scroll' },
  series: []
});

const updateSeries = () => {
  const yAxis = content?.yAxis;
  if (Array.isArray(yAxis)) {
    option.series = yAxis.map((name) => {
      return {
        type: 'bar',
        name,
        encode: {
          x: content?.xAxis,
          y: name
        }
      };
    });
  }
};

// set chart dataset
watch(() => dataSource, (source) => {
  option.dataset = [
    { source }
  ];
}, { immediate: true });

watch(() => content, () => {
  updateSeries();
}, { immediate: true });
</script>

<style lang="scss">
.chart {
  height: 100%;
}
</style>
