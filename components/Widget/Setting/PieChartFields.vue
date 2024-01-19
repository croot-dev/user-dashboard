<template>
  <v-row no-gutters>
    <v-col>
      <v-select
        v-model="form.name"
        :items="dataLabels"
        label="name"
        density="compact"
        required
        hide-details
        @update:model-value="onUpdateForm"
      />
    </v-col>
    <v-col>
      <v-select
        v-model="form.value"
        :items="dataLabels.filter(item => item !== form.name)"
        label="value"
        density="compact"
        required
        hide-details
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
  name: string | undefined;
  value: string | undefined;
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
  name: props.modelValue?.name,
  value: props.modelValue?.value
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
}, { immediate: true });

const onUpdateForm = () => {
  emits('update:modelValue', form);
};
</script>
