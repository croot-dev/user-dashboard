<template>
  <v-data-table
    :height="height"
    :items="data"
    :items-per-page="-1"
    density="compact"
  >
    <template #bottom />
  </v-data-table>
</template>
<script setup lang="ts">
const { wealthByAgeGroup } = useDatasetStore();

withDefaults(defineProps<{
  title: string;
  width: number;
  height: number;
}>(), {
  title: 'Undefined',
  width: 240,
  height: 240
});

const data = ref<any>([]);
watch(() => wealthByAgeGroup, () => {
  data.value = wealthByAgeGroup;
}, { immediate: true });

</script>
<style lang="scss" scoped>
.widget {
  width: 100%;
  height: 100%;
  background: #fff center/cover no-repeat;
}
</style>
