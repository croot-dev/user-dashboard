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

const props = defineProps<{
  title: string;
  width: number;
  height: number;
  dataSource: DatasetComponentOption['source'];
  chartOption?: BarSeriesOption[];
  content?: Widget.ContentBarChart;
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
  legend: { show: true },
  series: []
});

const updateSeries = () => {
  const yAxis = props.content?.yAxis;
  if (Array.isArray(yAxis)) {
    option.series = yAxis.map((name) => {
      return {
        type: 'bar',
        name,
        encode: {
          x: props.content?.xAxis,
          y: name
        }
      };
    });
  }
};

// set chart dataset
watch(() => props.dataSource, (source) => {
  option.dataset = [
    { source }
  ];
  updateSeries();
}, { immediate: true });

watch(() => props.content, ({ xAxis, yAxis }: Widget.ContentBarChart) => {
  if (option.dataset?.source) {
    updateSeries();
  }
}, { immediate: true });
</script>

<style lang="scss">
.chart {
  height: 100%;
}
</style>
