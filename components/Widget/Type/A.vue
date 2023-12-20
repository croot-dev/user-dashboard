<template>
  <div class="widget" :style="{ backgroundImage: `url(${data.imagesrc})` }">
    <span>{{ data.title }}</span>
    <h2 v-if="'maintext' in data">
      {{ data.maintext }}
    </h2>
    <span v-if="'caption' in data">{{ data.caption }}</span>
  </div>
</template>
<script setup lang="ts">
const data = defineProps<{
  title: string;
  maintext?: string;
  caption?: string;
  imagesrc?: string;
}>();
</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
  text-align: center;

  h2 {}
  span {}
}
</style>
