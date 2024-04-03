<template>
  <v-sheet class="mx-auto" max-width="300">
    <v-form validate-on="submit lazy" @submit.prevent="submit">
      <v-text-field
        v-model="formData.userName"
        :rules="[]"
        label="아이디"
      />
      <v-text-field
        v-model="formData.password"
        :rules="[]"
        label="비밀번호"
      />

      <v-btn
        :loading="loading"
        class="mt-2"
        text="Submit"
        type="submit"
        block
      />
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { PROVIDE_KEY } from '~/constants';
import type { API } from '~/types';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';

const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) as ToastProviderProps;
const loading = ref(false);
const timeout = ref(null);
const formData = reactive({
  userName: '',
  password: ''
});

const submit = async () => {
  loading.value = true;

  try {
    const { data } = await useFetch<API.DashboardDetailResponse>('/api/user/signIn', { method: 'POST', body: JSON.stringify(formData) });
    if (data.value?.statusCode === 200) {
      // TODO:: save data.value.body to localStorage
      navigateTo('/main');
    } else if (data.value?.error) {
      throw new Error(data.value.error.message);
    }
  } catch (error: any) {
    toast.show({ message: error.message });
  } finally {
    loading.value = false;
  }
};
</script>
