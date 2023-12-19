<template>
  <PieChart
    :key="height"
    ref="chartRef"
    :chartData="chartData"
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
import type { Chart } from 'chart.js'
import { ChartData } from 'chart.js'
const { wealthByAgeGroup } = useDatasetStore();

const data = defineProps<{
  title: string;
  width: number;
  height: number;
}>();

const chartRef = ref<Chart>();
const chartData: ChartData <'pie', number[]> = reactive({
  datasets: [{ data: [] }]
})
watch(() => wealthByAgeGroup, () => {
  chartData.datasets = [{
    label: 'Wealth by age group',
    data: wealthByAgeGroup.map(i => Number(i.value)),
  }];
  chartData.labels = wealthByAgeGroup.map(i => i.name);
  }, {immediate: true});

</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>