<template>
  <div class="widget" :style="{ height: height+'px' }">
    <v-chart
      class="chart"
      :option="option"
      autoresize
    />
  </div>
</template>
<script setup lang="ts">
import type { DatasetComponentOption, EChartsOption, BarSeriesOption } from 'echarts';
import VChart from 'vue-echarts';

import type { WIDGET_TYPE } from '~/constants';
import type { Widget } from '~/types';

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

/**
 * 차트 Series 수정
 */
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

/**
 * 차트 Source 수정
 */
const updateDataset = () => {
  option.dataset = [
    { source: dataSource }
  ];
};

watch(() => dataSource, updateDataset);
watch(() => content, updateSeries);

// Initialize
updateDataset();
updateSeries();

</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
}
</style>
