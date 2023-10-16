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
          @remove-widget="removeWidget(item.data.id)"
        >
          <WidgetContentA v-bind="{ ...item.data.content }" />
    </WidgetBox>
        </GridItem>
    </GridLayout>
</template>
<script setup lang="ts">
import type { Layout } from 'vue3-grid-layout-next/dist/helpers/utils.d.ts'
import { toRaw } from 'vue'
  interface IWidget {
    uuid: string;
    type: string;
    sizeX: string;
    sizeY: string;
    posX: string;
    posY: string;
    content: IWidgetContent
  }
  interface IWidgetContent {
    title: string;
    maintext?: string;
    caption?: string;
    imagesrc?: string;
  }

  const props = defineProps<{
    tabData: any;
    mode: Boolean
  }>();
  const emits = defineEmits(['change-edit-mode', 'save-widgets'])
  
  const widgetList = toRefs<IWidget[]>(props.tabData.contents)
  const layout = ref<Layout>([]);
  watch(widgetList, (value) => {
    layout.value = value.map((widget, i) => {
      const x = Number(widget.posX);
      const y = Number(widget.posY);
      const w = Number(widget.sizeX);
      const h = Number(widget.sizeY);
      return {
        i: widget.uuid,
        x,
        y,
        w,
        h,
        static: false
      }
    })
    lastUpdateTime.value = new Date().toISOString()
  })
  const lastUpdateTime = ref()
  const layoutUpdatedEvent = (newLayout :Layout) => {
    console.log(toRaw(newLayout))
  }

  // handle mode
  const isEditMode = ref(props.mode)
  const toggleMode = () => {
    emits('change-edit-mode', isEditMode)
  }

  const setDashboardList = async (widgets :IWidget) => {
    const body = { id: props.tabData.id, contents: widgets }
    const result = await fetch('/api/dashboard', { method: "POST", body: JSON.stringify(body) }).then((res) => res.json())
    return result
  }
  const save = (data) => {
    return setDashboardList(data);
  }
  const onClickSave = () => {
    save(layout.value).then((result) => {
      console.log(result)
      isEditMode.value = false
    })
  }
  const removeWidget = (id) => {
    const targetIndex = layout.value.findIndex(item => item.id === id)
    layout.value.splice(targetIndex,1)
  }

</script>
<style lang="scss" scoped>
.grid-item {
  background-color: #fff;
}

</style>