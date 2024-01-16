<template>
  <slot />
  <v-snackbar v-model="show" :color="color">
    {{ message }}
    <template #actions>
      <v-btn variant="text" @click="show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { PROVIDE_KEY } from '~/constants';

const show = ref(false);
const message = ref('');
const color = ref('');

export interface ToastProviderProps {
  show: (options: {
    message: string;
    color?: string;
  }) => void;
  hide: () => void;
}
provide<ToastProviderProps>(PROVIDE_KEY.TOAST, {
  show (options) {
    message.value = options.message;
    if (options?.color) {
      color.value = options?.color;
    }
    show.value = true;
  },
  hide () {
    show.value = false;
  }
});
</script>
