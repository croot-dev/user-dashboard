<template>
  <v-card class="widget-box" ref="cardRef" :loading="loading">
    <v-card-item>
      <div v-show="hideContent">Widget {{props.data.type}}</div>
      <component
        v-if="!hideContent"
        :is="component"
        v-bind="{...props.data}"
        :width="cardStyle.width"
        :height="cardStyle.height"
        />
    </v-card-item>

    <v-card-actions>
      <div class="widget-option">
        <ul>
          <WidgetOptionSetting />
          <WidgetOptionRemove @remove-widget="emits('remove-widget')" />
        </ul>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import WidgetOptionSetting from "./WidgetOptionSetting.vue";
import { componentMap } from '~/utils'
const emits = defineEmits(['remove-widget'])
const props = defineProps({
  data: {},
  loading: false,
  hideContent: false
})
const component = computed(() => componentMap.get(props.data.type))
const cardRef = ref(null)
const cardStyle = reactive({
  width: 0,
  height: 0
})

onMounted(() => {
  // Grid 적용으로 인한 강제 제어 순서 변경
  nextTick(() => {
    cardStyle.width = cardRef?.value.$el.getBoundingClientRect().width
    cardStyle.height = cardRef?.value.$el.getBoundingClientRect().height
  })
})

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
    flex: 0 0 30px
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