<template>
  <v-dialog
    v-model="isActive"
    width="500"
  >
    <template #activator="{ props: buttonProps }">
      <v-btn
        v-bind="buttonProps"
        size="small"
        icon="mdi-pencil-outline"
      />
    </template>

    <v-card title="Setting">
      <v-card-text>
        <v-form @submit.prevent>
          <v-container>
            <v-row no-gutters>
              <v-text-field
                v-model="form.title"
                :rules="[]"
                label="위젯명"
                density="compact"
                required
                hide-details
                clearable
              />
            </v-row>
            <v-row no-gutters>
              <v-select
                v-model="form.type"
                :items="widgetTypeOptions"
                label="Type"
                required
                hide-details
                density="compact"
                @update:model-value="onUpdateType"
              />
            </v-row>
            <v-row no-gutters>
              <v-select
                v-model="form.dataSourceType"
                :items="dataSourceTypeOptions"
                label="Data Source"
                required
                hide-details
                density="compact"
              />
            </v-row>
            <v-row no-gutters>
              <component
                :is="customFormField"
                :model-value="{
                  ...form.content
                }"
                :type="form.type"
                :data-source-type="form.dataSourceType"
                @update:model-value="onUpdateCustomField"
              />
            </v-row>
            <v-row no-gutters>
              <v-switch
                v-model="form.useLocalSetting"
                label="기간 개별 설정"
                density="compact"
                hide-details
              />
            </v-row>
            <v-row v-if="form.useLocalSetting" no-gutters>
              <v-col>
                <v-text-field
                  v-model="form.startDate"
                  :rules="[]"
                  label="조회시작일자"
                  density="compact"
                  required
                  hide-details
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="form.endDate"
                  :rules="[]"
                  label="조회종료일자"
                  density="compact"
                  required
                  hide-details
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="text"
          @click="onClickEdit"
        >
          Confirm
        </v-btn>
        <v-btn
          text="Cancel"
          @click="onClickCancel"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { WIDGET_TYPE, DATA_SOURCE_TYPE } from '~/constants';
import type { Widget } from '~/types';

interface FormData {
  title: string;
  type: Widget.Type;
  dataSourceType: Widget.Item['dataSourceType'];
  useLocalSetting: boolean;
  startDate?: Widget.Setting['startDate'];
  endDate?: Widget.Setting['endDate'];
  [key:string]: any;
}

interface Props {
  modelValue: FormData
}

const { modelValue } = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    title: 'Untitled',
    type: WIDGET_TYPE.INDICATOR,
    dataSourceType: DATA_SOURCE_TYPE.EMPTY,
    useLocalSetting: false,
    startDate: undefined,
    endDate: undefined
  })
});
const emits = defineEmits<{
  'update:setting': [FormData]
}>();

const isActive = ref(false);
const form = reactive<FormData>({ ...modelValue });
const widgetTypeOptions = ref(Object.entries(WIDGET_TYPE).map(([title, value]) => ({ title, value })));
const dataSourceTypeOptions = ref(Object.entries(DATA_SOURCE_TYPE).map(([title, value]) => ({ title, value })));

const customFormField = computed(() => {
  switch (form.type) {
  case WIDGET_TYPE.BAR:
  case WIDGET_TYPE.LINE:
    return defineAsyncComponent(() => import('./AxisChartFields.vue'));
  case WIDGET_TYPE.PIE:
    return defineAsyncComponent(() => import('./PieChartFields.vue'));
  case WIDGET_TYPE.SCATTER:
  default:
    return {};
  }
});

const onUpdateType = (widgetType: Widget.Type) => {
  form.content = {};
};

const onUpdateCustomField = (customFields: Widget.Content[typeof form.type]) => {
  form.content = customFields;
};

const onClickEdit = () => {
  emits('update:setting', form);
  isActive.value = false;
};
const onClickCancel = () => {
  isActive.value = false;
};
</script>
