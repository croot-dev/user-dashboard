<template>
  <v-row no-gutters>
    <v-col v-if="isIndividual">
      <v-text-field density="compact" hide-details hide-spin-buttons flat width="80" />
    </v-col>
    <v-col>
      <v-btn icon="mdi-calendar" size="x-small" @click="handleTrigger" />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const isIndividual = ref(false);
const handleTrigger = () => {
  isIndividual.value = !isIndividual.value;
};
</script>
