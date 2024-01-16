<template>
  <v-card
    ref="cardRef"
    class="widget-box"
    :loading="loading"
  >
    <v-card-item
      :title="$props.data.content.title"
      :subtitle="subtitle"
    >
      <v-skeleton-loader
        v-if="hideContent"
        type="image"
        boilerplate
      />
      <component
        :is="component"
        v-else
        :title="$props.data.content.title"
        :width="cardStyle.width"
        :height="cardStyle.height"
        v-bind="{ ...$props.data }"
      />
    </v-card-item>

    <div class="widget-option">
      <v-btn-group>
        <WidgetOptionSetting
          v-bind="{
            title: $props.data.content.title,
            type: $props.data.type,
            useLocalSetting,
            ...(useLocalSetting && { ...props.data.setting })
          }"
          @update:setting="handleUpdateSetting"
        />
        <WidgetOptionRemove v-if="isEdit" @remove-widget="emits('remove-widget', data.id)" />
      </v-btn-group>
    </div>
  </v-card>
</template>
<script setup lang="ts">
import type { VCard } from 'vuetify/lib/components/index.mjs';
import type { AsyncComponentLoader } from 'vue';
import WidgetOptionSetting, { type WidgetOptionSettingForm } from './OptionSetting.vue';
import WidgetOptionRemove from './OptionRemove.vue';
import type { Tab, Widget } from '~/types';
import { PROVIDE_KEY } from '~/constants';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';
import type { DashboardProvider } from '~/providers/DashboardProvider.vue';

interface Props {
  tabId: Tab.Id;
  data: Widget.Item<any>;
  globalSetting: Tab.GlobalSetting;
  isEdit?: boolean;
  loading?: boolean;
  hideContent?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
  hideContent: false
});
const emits = defineEmits<{
  'remove-widget': [Widget.Id]
}>();
const { updateWidget } = inject<DashboardProvider>(PROVIDE_KEY.DASHBOARD) as DashboardProvider;
const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) || { show: () => {} };

const getWidgetComponent = (typeCode: Widget.Type): AsyncComponentLoader => {
  return defineAsyncComponent(() => import(`~/components/Widget/Type/${typeCode}.vue`)
    .catch((error) => {
      console.log(error.message);
      return import('~/components/Widget/Type/Empty.vue');
    }));
};
const component = computed(() => getWidgetComponent(props.data.type));
const cardRef = shallowRef<VCard>();
const cardStyle = reactive({
  width: 0,
  height: 0
});
const useLocalSetting = computed(() => { return !!(props.data.setting && 'startDate' in props.data.setting && 'endDate' in props.data.setting); });
const subtitle = computed(() => (
  (useLocalSetting.value)
    ? `${props.data.setting?.startDate} ~ ${props.data.setting?.endDate}`
    : `${props.globalSetting.startDate} ~ ${props.globalSetting.endDate}`
));

onMounted(() => {
  // Grid 적용으로 인한 강제 제어 순서 변경
  nextTick(() => {
    if (cardRef.value) {
      cardStyle.width = cardRef.value.$el.getBoundingClientRect().width;
      cardStyle.height = cardRef.value.$el.getBoundingClientRect().height - 76;
    }
  });
});

const handleUpdateSetting = (settingData: WidgetOptionSettingForm) => {
  const body: Partial<Widget.Item> = {
    type: settingData.type || props.data.type,
    content: { title: settingData.title || props.data.content.title },
    ...(settingData.useLocalSetting && {
      setting: {
        startDate: settingData.startDate || '',
        endDate: settingData.endDate || ''
      }
    })
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
}
</style>
../../composables/useGridLayout
