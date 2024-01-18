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
import type { AxisForm } from './OptionSetting.vue';
import { DATA_SOURCE_TYPE } from '~/constants';
import type { Widget } from '~/types';

interface Props {
  type: Widget.Type;
  dataSource: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE];
  modelValue?: AxisForm
}
export interface WidgetOptionSettingAxisForm extends Props {}
const props = defineProps<Props>();
const emits = defineEmits<{
  'update:modelValue': [AxisForm]
}>();

const form = reactive<AxisForm>({
  xAxis: props.modelValue?.xAxis,
  yAxis: props.modelValue?.yAxis
});

const dataset = useDatasetStore();
const dataLabels = ref<string[]>([]);
watch(() => props.dataSource, (value) => {
  dataLabels.value = [];
  const source: any[] = dataset.get(value);
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
