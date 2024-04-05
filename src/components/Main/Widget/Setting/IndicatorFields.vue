<template>
  <v-row no-gutters>
    <v-col>
      <v-select
        v-model="form.column"
        :items="dataColumns.filter(item => item !== form.column)"
        label="column"
        density="compact"
        required
        hide-details
        @update:model-value="onUpdateForm"
      />
    </v-col>
    <v-col>
      <v-select
        v-model="form.calculator"
        :items="calculators.filter(item => item !== form.calculator)"
        label="calculator"
        density="compact"
        required
        hide-details
        @update:model-value="onUpdateForm"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { DATA_SOURCE_TYPE, WIDGET_INDICATOR_CALCULATOR } from '~/constants';
import type { Widget, ValueOf } from '~/types';

export interface IndicatorFormItems {
  column: string | undefined;
  calculator: ValueOf<typeof WIDGET_INDICATOR_CALCULATOR>;
}

interface Props {
  type: Widget.Type;
  dataSourceType: ValueOf<typeof DATA_SOURCE_TYPE>;
  modelValue?: IndicatorFormItems
}

// externals
const props = defineProps<Props>();
const emits = defineEmits<{
  'update:modelValue': [IndicatorFormItems]
}>();

// hooks
const dataset = useDatasetStore();

// internals
const form = reactive<IndicatorFormItems>({
  column: props.modelValue?.column,
  calculator: props.modelValue?.calculator || WIDGET_INDICATOR_CALCULATOR.SUM
});
const dataColumns = ref<string[]>([]);
const calculators = Object.values(WIDGET_INDICATOR_CALCULATOR);
const setDataColumns = async () => {
  const source = await dataset.get(props.dataSourceType);
  if (Array.isArray(source[0])) {
    dataColumns.value = source[0];
  } else {
    dataColumns.value = Object.keys(source[0]);
  }
};
const onUpdateForm = () => {
  emits('update:modelValue', form);
};

watch(() => props.dataSourceType, () => {
  form.column = undefined;
  form.calculator = WIDGET_INDICATOR_CALCULATOR.SUM;
  setDataColumns();
});
setDataColumns();

</script>
