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
                v-model="form.dataSource"
                :items="dataSourceOptions"
                label="Data Source"
                required
                hide-details
                density="compact"
              />
            </v-row>
            <OptionSettingAxis
              v-if="showAxisForm"
              :model-value="{
                xAxis: form.xAxis,
                yAxis: form.yAxis
              }"
              :type="form.type"
              :data-source="form.dataSource"
              @update:model-value="onUpdateAxis"
            />
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
import OptionSettingAxis from './OptionSettingAxis.vue';
import { WIDGET_TYPE, DATA_SOURCE_TYPE } from '~/constants';
import type { Widget } from '~/types';

interface Props {
  title?: string;
  type: Widget.Type;
  dataSource: Widget.Content['dataSource'];
  xAxis: string | void;
  yAxis: string[];
  useLocalSetting: boolean;
  startDate?: Widget.Setting['startDate'] | null;
  endDate?: Widget.Setting['endDate'] | null;
}
export interface WidgetOptionSettingForm extends Props {}
export interface AxisForm {
  xAxis: WidgetOptionSettingForm['xAxis'];
  yAxis: WidgetOptionSettingForm['yAxis'];
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  type: WIDGET_TYPE.INDICATOR,
  dataSource: DATA_SOURCE_TYPE.EMPTY,
  startDate: null,
  endDate: null
});
const emits = defineEmits<{
  'update:setting': [WidgetOptionSettingForm]
}>();

const isActive = ref(false);
const form = reactive<Props>({
  title: props.title,
  type: props.type,
  xAxis: props.xAxis,
  yAxis: props.yAxis,
  dataSource: props.dataSource,
  useLocalSetting: props.useLocalSetting,
  startDate: props.useLocalSetting ? props.startDate : null,
  endDate: props.useLocalSetting ? props.endDate : null
});
const widgetTypeOptions = ref(Object.entries(WIDGET_TYPE).map(([title, value]) => ({ title, value })));
const dataSourceOptions = ref(Object.entries(DATA_SOURCE_TYPE).map(([title, value]) => ({ title, value })));

const showAxisForm = computed(() => [WIDGET_TYPE.BAR, WIDGET_TYPE.LINE, WIDGET_TYPE.PIE].includes(form.type));
const onUpdateType = (widgetType: Widget.Type) => {
  if (!showAxisForm) {
    form.xAxis = undefined;
    form.yAxis = undefined;
  }
};

const onUpdateAxis = (axisForm: AxisForm) => {
  form.xAxis = axisForm.xAxis;
  form.yAxis = axisForm.yAxis;
};

const onClickEdit = () => {
  emits('update:setting', form);
  isActive.value = false;
};
const onClickCancel = () => {
  isActive.value = false;
};
</script>
