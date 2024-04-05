<template>
  <v-card
    ref="cardRef"
    class="widget-box"
    :loading="loading"
  >
    <v-card-item
      :title="$props.data.title"
      :subtitle="subtitle"
      :class="(useLocalSetting && 'mark-subtitle')"
    >
      <v-skeleton-loader
        v-if="hideContent"
        type="image"
        boilerplate
      />
      <component
        :is="component"
        v-else
        v-bind="{ ...$props.data }"
        :width="cardStyle.width"
        :height="cardStyle.height"
        :data-source="dataSource"
      />
    </v-card-item>

    <div class="widget-option">
      <v-btn-group>
        <WidgetSettingForm
          v-if="!isEdit"
          :model-value="{
            title: $props.data.title,
            type: $props.data.type,
            dataSourceType: $props.data.dataSourceType,
            ...($props.data.content && { content: $props.data.content }),
            ...(useLocalSetting && { ...props.data.setting })
          }"
          @update:setting="handleUpdateSetting"
        />
        <WidgetRemoveButton v-if="isEdit" @remove-widget="emits('remove-widget', data.id)" />
      </v-btn-group>
    </div>
  </v-card>
</template>
<script setup lang="ts">
import type { AsyncComponentLoader } from 'vue';
import type { VCard } from 'vuetify/components';
import { PROVIDE_KEY } from '~/constants';
import type { Tab, Widget } from '~/types';
import type { DashboardProvider } from '~/providers/DashboardProvider.vue';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';
import { useDatasetStore } from '~/stores/dataset';
import WidgetRemoveButton from './RemoveButton.vue';
import WidgetSettingForm from './Setting/Form.vue';

interface WidgetContainerProps {
  tabId: Tab.Id;
  data: Widget.Item<any>;
  globalSetting: Tab.GlobalSetting;
  isEdit?: boolean;
  loading?: boolean;
  hideContent?: boolean;
}
const props = withDefaults(defineProps<WidgetContainerProps>(), {
  isEdit: false,
  loading: false,
  hideContent: false
});
const emits = defineEmits<{
  'remove-widget': [Widget.Id]
}>();
const { updateWidget } = inject<DashboardProvider>(PROVIDE_KEY.DASHBOARD)!;
const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) || { show: () => {} };

// set widget component
const getWidgetComponent = (typeCode: Widget.Type): AsyncComponentLoader => {
  return defineAsyncComponent(() => import(`./Type/${typeCode}.vue`)
    .catch((error) => {
      console.log(error.message);
      return import('./Type/Empty.vue');
    }));
};
const component = computed(() => getWidgetComponent(props.data.type));
const useLocalSetting = computed(() => { return !!(props.data.setting && 'startDate' in props.data.setting && 'endDate' in props.data.setting); });
const subtitle = computed(() => (
  (useLocalSetting.value)
    ? `${props.data.setting?.startDate} ~ ${props.data.setting?.endDate}`
    : `${props.globalSetting.startDate} ~ ${props.globalSetting.endDate}`
));

// set widget size
const cardRef = shallowRef<VCard>();
const cardStyle = reactive({
  width: 0,
  height: 0
});
onMounted(() => {
  // Grid 적용으로 인한 강제 제어 순서 변경
  nextTick(() => {
    if (cardRef.value) {
      cardStyle.width = cardRef.value.$el.getBoundingClientRect().width;
      cardStyle.height = cardRef.value.$el.getBoundingClientRect().height - 76;
    }
  });
});

// set widget data
const dataSource = ref();
const getDataSource = async () => {
  const dataset = useDatasetStore();
  const sourceType = props.data.dataSourceType;
  const source = await dataset.get(sourceType);
  dataSource.value = source;
};
getDataSource();

// handle widget setting
const handleUpdateSetting = (settingData: any) => {
  const body: Partial<Widget.Item> = {
    type: settingData.type || props.data.type,
    title: settingData.title || props.data.title,
    dataSourceType: settingData.dataSourceType,
    content: settingData.content,
    setting: settingData.useLocalSetting
      ? {
        startDate: settingData.startDate || '',
        endDate: settingData.endDate || ''
      }
      : undefined
  };
  updateWidget(props.tabId, props.data.id, body)
    .then(() => {
      toast.show({ message: 'widget updated' });
    });
};
</script>

<style lang="scss" scoped>
.widget-box {
  height: 100%;
  &:hover .widget-option {
    opacity: 1;
  }

  .v-card-item {
    display: block;
    height: 100%;
  }
  .v-card-actions {
    flex: 0 0 30px;
  }

  .widget-option {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
  }

  :global(.widget-box .mark-subtitle .v-card-subtitle) {
    color: #f54600;
  }
}
</style>
