<template>
  <v-sheet class="mx-auto" max-width="300">
    <v-form validate-on="submit lazy" @submit.prevent="submit">
      <v-text-field
        v-model="formData.userId"
        :rules="[]"
        label="아이디"
      />
      <v-text-field
        v-model="formData.userPassword"
        :rules="[]"
        label="비밀번호"
      />
      <v-text-field
        v-model="passwordCheck"
        :rules="[]"
        label="비밀번호 확인"
      />
      <v-text-field
        v-model="formData.userName"
        :rules="[]"
        label="이름"
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
import type { API } from '~/types';

const loading = ref(false);
const timeout = ref(null);
const formData = reactive({
  userId: '',
  userPassword: '',
  userName: ''
});
const passwordCheck = ref('');

const submit = async (event) => {
  loading.value = true;

  try {
    const { data }: API.DashboardDetailResponse = await useFetch('/api/user/signUp', { method: 'POST', body: JSON.stringify(formData) });
    console.log(data);
  } catch (error: any) {
    toast.show({ message: error.message });
  } finally {
    loading.value = false;
  }
};

</script>
