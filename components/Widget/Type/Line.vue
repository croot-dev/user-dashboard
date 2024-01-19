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
import type { WIDGET_TYPE } from '~/constants';
import type { Widget } from '~/types';

const { dataSource, content } = defineProps<{
  title: string;
  width: number;
  height: number;
  dataSource: DatasetComponentOption['source'];
  chartOption?: LineSeriesOption[];
  content?: Widget.Content[typeof WIDGET_TYPE.LINE];
}>();

const option = reactive<EChartsOption>({
  grid: {
    left: 40,
    right: 10,
    bottom: 30,
    top: 30
  },
  dataset: [],
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  tooltip: { show: true, trigger: 'axis' },
  legend: { show: true, type: 'scroll' },
  series: []
});

const updateSeries = () => {
  const yAxis = content?.yAxis;
  if (Array.isArray(yAxis)) {
    option.series = yAxis.map((name) => {
      return {
        type: 'line',
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
