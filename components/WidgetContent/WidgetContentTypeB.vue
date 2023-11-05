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
import { ChartData } from 'chart.js'
const { incomeByAgeGroup } = useDatasetStore();

const data = defineProps<{
  title: string;
  width: number;
  height: number;
}>();

const chartData = reactive<ChartData <'line', {name: string, value: number} []>>({
  datasets: [{ data: [] }]
})
const chartRef = ref();
watch(() => incomeByAgeGroup, () => {
  chartData.datasets = [{
    label: 'Income by age group',
    data: incomeByAgeGroup,
    parsing: {
      xAxisKey: 'name',
      yAxisKey: 'value'
    }
  }];
  nextTick(() => {
    console.log(chartData)
  })
  }, {immediate: true});

</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>