import { CanvasRenderer } from 'echarts/renderers';

import {
  LineChart,
  PieChart,
  BarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
import { use } from 'echarts/core';

export default defineNuxtPlugin((app) => {
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DatasetComponent
  ]);
});
