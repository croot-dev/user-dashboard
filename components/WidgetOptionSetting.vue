<template>

  <v-dialog
    v-model="isActive"
    width="500"
    >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        size="small"
        icon="mdi-pencil-outline"
      ></v-btn>
    </template>

    <v-card title="Dialog">
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          variant="text"
          @click="onClickEdit"
        >
          Confirm
        </v-btn>
        <v-btn
          text="Cancel"
          @click="onClickCancel"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const emits = defineEmits(['edit-widget'])
const isActive = ref(false)
const onClickEdit = () => {
  isActive.value = false
  emits('edit-widget')
}
const onClickCancel = () => {
  isActive.value = false
}
</script>
