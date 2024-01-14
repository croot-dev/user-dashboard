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
        v-bind="{ ...$props.data }"
        :width="cardStyle.width"
        :height="cardStyle.height"
      />
    </v-card-item>

    <div class="widget-option">
      <v-btn-group>
        <WidgetOptionSetting />
        <WidgetOptionRemove v-if="isEdit" @remove-widget="emits('remove-widget')" />
      </v-btn-group>
    </div>
  </v-card>
</template>
<script setup lang="ts">
import type { VCard } from 'vuetify/lib/components/index.mjs';
import WidgetOptionSetting from './OptionSetting.vue';
import WidgetOptionRemove from './OptionRemove.vue';
import type { Tab, Widget } from '~/types';

const getWidgetComponent = (typeCode : Widget.Type) => {
  return defineAsyncComponent(() => import(`~/components/Widget/Type/${typeCode}.vue`));
};

const props = withDefaults(defineProps<{
  data: {
    title: string;
    type: Widget.Type;
    content: Widget.Content;
    setting?: Widget.Setting;
  };
  globalSetting: Tab.globalSetting;
  isEdit?: boolean;
  loading?: boolean;
  hideContent?: boolean;
}>(), {
  isEdit: false,
  loading: false,
  hideContent: false,
  content: { title: '' }
});
const emits = defineEmits(['remove-widget']);
const component = computed(() => getWidgetComponent(props.data.type));
const cardRef = shallowRef<VCard>();
const cardStyle = reactive({
  width: 0,
  height: 0
});
const useLocalSetting = computed(() => { return !!(props.data.setting && 'startDate' in props.data.setting && 'endDate' in props.data.setting); });
const subtitle = computed(() => {
  if (useLocalSetting.value) {
    return `${props.data.setting?.startDate} ~ ${props.data.setting?.endDate}`;
  } else {
    return `${props.globalSetting.startDate} ~ ${props.globalSetting.endDate}`;
  }
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
