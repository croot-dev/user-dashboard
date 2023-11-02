import { Chart, registerables } from 'chart.js';

export default defineNuxtPlugin((app) => {
    Chart.register(...registerables);
})