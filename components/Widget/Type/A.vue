<template>
  <div
    class="widget"
    :style="{
      height: `${data.height}px`,
      ...('imagesrc' in data && { backgroundImage: `url(${data.imagesrc})`})
    }"
  >
    <h2 v-if="'maintext' in data">
      {{ data.maintext }}
    </h2>
    <span v-if="'caption' in data">{{ data.caption }}</span>
  </div>
</template>

<script setup lang="ts">
const data = defineProps<{
  title: string;
  height: string;
  maintext?: string;
  caption?: string;
  imagesrc?: string;
}>();
</script>

<style lang="scss" scoped>
.widget {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
  text-align: center;

  h2 {}
  span {}
}
</style>
