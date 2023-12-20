<template>
  <v-dialog
    v-model="isActive"
    width="500"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        size="small"
        icon="mdi-delete-outline"
      />
    </template>

    <v-card title="위젯 삭제">
      <v-card-text>
        해당 위젯을 삭제하시겠습니까?
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="text"
          @click="onClickRemove"
        >
          Confirm
        </v-btn>
        <v-btn
          text="Cancel"
          @click="onClickCancel"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const emits = defineEmits(['remove-widget']);
const isActive = ref(false);
const onClickRemove = () => {
  isActive.value = false;
  emits('remove-widget');
};
const onClickCancel = () => {
  isActive.value = false;
};
</script>
