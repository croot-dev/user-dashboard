<template>
    <v-row>
      <v-col>
        Last Updated: {{ lastUpdateTime }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-switch
          v-model="isEditMode"
          :label="isEditMode? 'edit' : 'read'"
          size="small"
          hide-details
          @change="toggleMode"
          ></v-switch>
        <v-btn v-if="isEditMode" size="small" @click="onClickSave">Save</v-btn>
      </v-col>
    </v-row>
    <GridLayout
      :layout="layout"
      :col-num="4"
      :max-rows="4"
      :row-height="240"
      :is-draggable="isEditMode"
      :is-resizable="isEditMode"
      :responsive="false"
      :breakpoints="{}"
      @layout-updated="layoutUpdatedEvent"
    >
      <GridItem
        v-for="item in layout"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        class="grid-item"
      >
        <WidgetBox
          v-bind="{
            sizeX: item.data.sizeX,
            sizeY: item.data.sizeY,
          }"
        >
          <WidgetContentA v-bind="{ ...item.data.content }" />
    </WidgetBox>
        </GridItem>
    </GridLayout>
</template>
<script setup lang="ts">
import { toRaw } from 'vue'
  interface IWidget {
    uuid: String;
    type: String;
    sizeX: String;
    sizeY: String;
    posX: String;
    posY: String;
    content: IWidgetContent
  }
  interface IWidgetContent {
    title: String;
    maintext?: String;
    caption?: String;
    imagesrc?: String;
  }

  const props = defineProps<{
    widgetList: IWidget[]
    mode: Boolean
  }>();
  const emits = defineEmits(['change-edit-mode', 'save-widgets'])
  
  const { widgetList } = toRefs(props)
  const layout = ref([]);
  watch(widgetList, (value) => {
    layout.value = value.map((widget, i) => {
      const x = Number(widget.posX);
      const y = Number(widget.posY);
      const w = Number(widget.sizeX);
      const h = Number(widget.sizeY);
      return {
        i,
        x,
        y,
        w,
        h,
        static: false,
        data: widget
      }
    })
    lastUpdateTime.value = new Date().toISOString()
  })
  const lastUpdateTime = ref(new Date().toISOString())
  const save = () => {
    emits('save-widgets', toRaw(layout.value))
  }
  const layoutUpdatedEvent = (newLayout) => {
    console.log(toRaw(newLayout))
  }

  // handle mode
  const isEditMode = ref(props.mode)
  const toggleMode = () => {
    emits('change-edit-mode', isEditMode)
  }
  const onClickSave = () => {
    save()
  }

</script>
<style lang="scss" scoped>
.grid-item {
  background-color: #fff;
}

</style>