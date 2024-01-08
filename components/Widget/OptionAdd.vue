<template>
  <v-dialog
    v-model="dialog"
    activator="parent"
    width="auto"
  >
    <v-card>
      <v-card-text>
        <v-select
          label="Select"
          :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="handleClickClose">
          Close Dialog
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const emits = defineEmits(['add-widget']);
const dialog = ref(false);
const handleClickClose = () => {
  dialog.value = false;
};

</script>
