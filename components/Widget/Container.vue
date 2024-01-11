<template>
  <VCard
    ref="cardRef"
    class="widget-box"
    :loading="loading"
  >
    <VCardItem>
      <div v-show="hideContent">
        Widget {{ props.data.type }}
      </div>
      <component
        :is="component"
        v-if="!hideContent"
        v-bind="{ ...props.data }"
        :width="cardStyle.width"
        :height="cardStyle.height"
      />
    </VCardItem>

    <VCardActions>
      <div class="widget-option">
        <ul>
          <WidgetOptionSetting />
          <WidgetOptionRemove @remove-widget="emits('remove-widget')" />
        </ul>
      </div>
    </VCardActions>
  </VCard>
</template>
<script setup lang="ts">
import type { VCard } from 'vuetify/lib/components/index.mjs';
import WidgetOptionSetting from './OptionSetting.vue';
import WidgetOptionRemove from './OptionRemove.vue';
import { getWidgetComponent } from '~/utils';
import type { WidgetType } from '~/types';
const props = withDefaults(defineProps<{
  data: {
    title: string,
    type: WidgetType
  };
  loading?: boolean;
  hideContent?: boolean;
}>(), {
  loading: false,
  hideContent: false
});
const emits = defineEmits(['remove-widget']);
const component = computed(() => getWidgetComponent(props.data.type));
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
      cardStyle.height = cardRef.value.$el.getBoundingClientRect().height;
    }
  });
});
</script>

<style lang="scss" scoped>
.widget-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  &:hover .widget-option {
    opacity: 1;
  }

  .v-card-item {
    flex: 1 1 auto;
  }
  .v-card-actions {
    flex: 0 0 30px;
  }

  .widget-option {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;

    ul {
      display: flex;
      flex-direction: row;
      list-style: none;
    }
    li {
    }
  }
}
</style>
