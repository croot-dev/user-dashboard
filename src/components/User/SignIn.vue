<template>
  <v-sheet class="mx-auto" max-width="300">
    <v-form validate-on="submit lazy" @submit.prevent="submit">
      <v-text-field
        v-model="formData.userName"
        :rules="[value => checkApi(value)]"
        label="아이디"
      />
      <v-text-field
        v-model="formData.password"
        :rules="[value => checkApi(value)]"
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
const loading = ref(false);
const timeout = ref(null);
const formData = reactive({
  userName: '',
  password: ''
});

const submit = async (event) => {
  loading.value = true;

  try {
    const { data }: API.DashboardDetailResponse = await useFetch('/api/user/signIn', { method: 'POST', body: JSON.stringify(formData) });
    console.log(data);
  } catch (error: any) {
    toast.show({ message: error.message });
  } finally {
    loading.value = false;
  }
};

const checkApi = (userName) => {
  return new Promise((resolve) => {
    clearTimeout(timeout.value);

    timeout.value = setTimeout(() => {
      if (!userName) { return resolve('Please enter a user name.'); };
      if (userName === 'johnleider') { return resolve('User name already taken. Please try another one.'); };

      return resolve(true);
    }, 1000);
  });
};
</script>
