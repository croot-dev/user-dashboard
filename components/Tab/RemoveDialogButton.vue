<template>
  <v-dialog v-model="dialog" width="300">
    <template #activator="{props}">
      <v-icon
        icon="mdi-close"
        size="small"
        color="grey-lighten-1"
        v-bind="props"
      />
    </template>
    <v-card>
      <v-card-text>
        삭제하시겠습니까?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="onClickRemoveDashboard"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { PROVIDE_KEY } from '~/constants';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';
import type { Tab } from '~/types';

const { tabId, successCallback } = defineProps<{
  tabId: Tab.Id;
  successCallback:() => void
}>();

const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) as ToastProviderProps;
const dialog = ref(false);
const onClickRemoveDashboard = async () => {
  try {
    await useFetch(`/api/dashboard/${tabId}`, { method: 'DELETE' });
    (typeof successCallback === 'function') && successCallback();
  } catch (error: any) {
    console.log(error);
    toast.show({ message: error.message });
  } finally {
    dialog.value = false;
  }
};

</script>
