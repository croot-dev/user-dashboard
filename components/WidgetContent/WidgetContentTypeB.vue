<template>
  <LineChart
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
import { useDatasetStore } from "@/stores/dataset"
import { LineChart } from 'vue-chart-3';
import type { Chart } from 'chart.js'
import { ChartData } from 'chart.js'
const { wealthByAgeGroup } = useDatasetStore();

const data = defineProps<{
  title: string;
  width: number;
  height: number;
}>();

const chartRef = ref<Chart>();
const chartData = reactive<ChartData <'line', {name: string, value: number} []>>({
  datasets: [{ data: [] }]
})
watch(() => wealthByAgeGroup, () => {
  chartData.datasets = [{
    label: 'Wealth by age group',
    data: wealthByAgeGroup,
    parsing: {
      xAxisKey: 'name',
      yAxisKey: 'value'
    }
  }];
  }, {immediate: true});

</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>