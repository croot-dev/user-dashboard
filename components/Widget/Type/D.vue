<template>
  <PieChart
    :key="height"
    ref="chartRef"
    :chart-data="(chartData as unknown as ChartDataType<'pie'>)"
    :width="width"
    :height="height"
    :options="{
      responsive: true,
      maintainAspectRatio: false
    }"
  />
</template>
<script setup lang="ts">
import { PieChart } from 'vue-chart-3';
import type { Chart, ChartData as ChartDataType } from 'chart.js';
const { wealthByAgeGroup } = useDatasetStore();

defineProps<{
  title: string;
  width: number;
  height: number;
}>();

const chartRef = ref<Chart>();
const chartData: ChartDataType <'pie', number[]> = reactive({
  datasets: [{ data: [] }]
});
watch(() => wealthByAgeGroup, () => {
  chartData.datasets = [{
    label: 'Wealth by age group',
    data: wealthByAgeGroup.map(i => Number(i.value))
  }];
  chartData.labels = wealthByAgeGroup.map(i => i.name);
}, { immediate: true });

</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>
