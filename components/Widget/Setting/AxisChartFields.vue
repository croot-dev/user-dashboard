<template>
  <v-row no-gutters>
    <v-col>
      <v-select
        v-model="form.xAxis"
        :items="dataLabels"
        label="xAxis"
        density="compact"
        required
        hide-details
        @update:model-value="onUpdateForm"
      />
    </v-col>
    <v-col>
      <v-select
        v-model="form.yAxis"
        :items="dataLabels.filter(item => item !== form.xAxis)"
        label="yAxis"
        density="compact"
        required
        hide-details
        multiple
        clearable
        @update:model-value="onUpdateForm"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { DATA_SOURCE_TYPE } from '~/constants';
import type { Widget } from '~/types';

export interface AxisFormItems {
  xAxis: string | void;
  yAxis: string[];
}

interface Props {
  type: Widget.Type;
  dataSourceType: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE];
  modelValue?: AxisFormItems
}

const props = defineProps<Props>();
const emits = defineEmits<{
  'update:modelValue': [AxisFormItems]
}>();

const form = reactive<AxisFormItems>({
  xAxis: props.modelValue?.xAxis,
  yAxis: props.modelValue?.yAxis || []
});

const dataset = useDatasetStore();
const dataLabels = ref<string[]>([]);
watch(() => props.dataSourceType, async (value) => {
  dataLabels.value = [];
  const source = await dataset.get(value);
  if (Array.isArray(source[0])) {
    dataLabels.value = source[0];
  } else {
    dataLabels.value = Object.keys(source[0]);
  }

  if (!dataLabels.value.includes(form.xAxis) || !form.yAxis.every(item => dataLabels.value.includes(item))) {
    form.xAxis = undefined;
    form.yAxis = [];
  }
}, { immediate: true });

const onUpdateForm = () => {
  emits('update:modelValue', form);
};
</script>
