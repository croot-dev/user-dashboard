<template>
  <div class="widget" :style="{ height: height+'px' }">
    <VChart
      class="chart"
      :option="option"
      autoresize
    />
  </div>
</template>
<script setup lang="ts">
import type { DatasetComponentOption, EChartsOption, LineSeriesOption } from 'echarts';
import VChart from 'vue-echarts';
import type { Widget } from '~/types';

const props = defineProps<{
  title: string;
  width: number;
  height: number;
  dataSource: DatasetComponentOption['source'];
  chartOption?: LineSeriesOption[];
  content?: Widget.ContentLineChart;
}>();

const option = reactive<EChartsOption>({
  grid: {
    left: 50,
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
        type: 'line',
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

watch(() => props.content, ({ xAxis, yAxis }: Widget.ContentLineChart) => {
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
