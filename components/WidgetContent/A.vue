<template>
  <div class="widget" :style="{ backgroundImage: `url(${data.imagesrc})` }">
    <span>{{ data.title }}</span>
    <div>{{ data.maintext }}</div>
    <span v-if="'caption' in data">{{ data.caption }}</span>
  </div>
</template>
<script setup lang="ts">
const data = defineProps<{
  title: String;
  maintext?: String;
  caption?: String;
  imagesrc?: String;
}>();
</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>