<template>
  <v-form @submit.prevent>
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
            bg-color="#FFFFFF"
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
            bg-color="#FFFFFF"
          />
        </v-col>

        <v-spacer />

        <v-col
          cols="12"
          md="3"
        >
          <v-btn
            color="#05A3F2"
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
import dayjs from 'dayjs';
import { reactive } from 'vue';

import type { Tab, Widget } from '~/types';

interface FormData {
  startDate: Tab.GlobalSetting['startDate'];
  endDate: Tab.GlobalSetting['endDate'];
}
interface Props {
  initialData: FormData
}
const DATE_FORMAT = 'YYYY-MM-DD';
const props = withDefaults(
  defineProps<Props>(),
  {
    initialData: () => ({
      startDate: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      endDate: dayjs().format(DATE_FORMAT)
    })
  }
);
const emits = defineEmits(['update:value']);

const conditionValues = reactive<FormData>({
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
