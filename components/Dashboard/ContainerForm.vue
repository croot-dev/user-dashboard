<template>
  <v-form>
    <v-container>
      <v-row align="center">
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="conditionValues.startDate"
            :rules="[]"
            :counter="10"
            label="Start Date"
            suffix="🕗 00:00:00"
            required
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
            suffix="🕗 23:59:59"
            hide-details
          />
        </v-col>

        <v-spacer />

        <v-col
          cols="12"
          md="3"
        >
          <v-btn
            color="primary"
            @click="submit"
          >
            <v-icon icon="mdi-magnify" />
          </v-btn>
          <v-btn
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
import dayjs, { Dayjs } from 'dayjs';
import type { Tab, Widget } from '~/types';

const DATE_FORMAT = 'YYYY-MM-DD';
const props = withDefaults(
  defineProps<{
    initialData: Tab.globalSetting
  }>(),
  {
    initialData: {
      startDate: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      endDate: dayjs().format(DATE_FORMAT)
    }
  }
);
const emits = defineEmits(['update:value']);

const conditionValues = reactive({
  startDate: props.initialData.startDate,
  endDate: props.initialData.endDate
});
const resetConditionValues = () => {
  conditionValues.startDate = props.initialData.startDate;
  conditionValues.endDate = props.initialData.endDate;
};

const validate = async ():Promise<boolean> => {
  const example = await 0 + 1 === 1;
  return example;
};

const submit = async () => {
  const isValid = await validate();
  if (isValid) {
    const emitData: Widget.Setting = {
      startDate: conditionValues.startDate,
      endDate: conditionValues.endDate
    };
    emits('update:value', emitData);
  } else {
    // empty..
  }
};

</script>
<style lang="scss" scoped>
</style>
