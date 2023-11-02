<template>
  <LineChart
    :key="height"
    ref="chartRef"
    :chartData="testData"
    :width="width"
    :height="height"
    :options="{
      responsive: true,
      maintainAspectRatio: false
    }"
    />
</template>
<script setup lang="ts">
import { LineChart } from 'vue-chart-3';

const data = defineProps<{
  title: string;
  width: number;
  height: number;
}>();

const testData = {
  labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
  datasets: [
    {
      data: [30, 40, 60, 70, 5],
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
    },
  ],
};

const chartRef = ref();
</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>