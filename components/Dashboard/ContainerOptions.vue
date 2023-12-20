<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="conditionValues.startDate"
            :rules="[]"
            :counter="10"
            label="Start Date"
            required
            single-line
            hide-details
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="conditionValues.endDate"
            :rules="[]"
            :counter="10"
            label="End Date"
            required
            single-line
            hide-details
          />
        </v-col>

        <v-spacer />

        <v-col
          cols="12"
          md="3"
        >
          <v-btn
            size="small"
            color="success"
            @click="validate"
          >
            <v-icon icon="mdi-magnify" />
          </v-btn>
          <v-btn
            size="small"
            @click="resetConditionValues"
          >
            <v-icon icon="mdi-eraser" />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
const emits = defineEmits(['update:value']);
const today = dayjs();
const conditionValues = reactive({
  startDate: '',
  endDate: ''
});
const resetConditionValues = () => {
  conditionValues.startDate = today.subtract(1, 'month').format('YYYY-MM-DD');
  conditionValues.endDate = today.format('YYYY-MM-DD');
};
const validate = () => {
  const example = 0 + 1 === 1;
  if (example) {
    submit();
  }
  return false;
};
const submit = () => {
  emits('update:value', conditionValues);
};

onMounted(() => {
  resetConditionValues();
});
</script>
<style lang="scss" scoped>
</style>
