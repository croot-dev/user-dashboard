// @ts-nocheck
import { defineStore } from 'pinia';
import { parse } from 'papaparse';
import { wealthByAgeGroupData } from './data/wealthByAgeGroup';
import { toSnakeCase } from '~/utils';
import { DATA_SOURCE_TYPE } from '~/constants';

export const useDatasetStore = defineStore('dataset', () => {
  const dataset = ref([]);
  const initialized = ref(false);
  const load = () => {
    initialized.value = false;
    return new Promise(() => {
      parse('/dataset/billionaires.csv', {
        header: true,
        download: true,
        complete ({ data }) {
          // const result = data.map((originalData) => {
          //   const nestedJSON = {};
          //   for (const key in originalData) {
          //     const keys = key.split('.');
          //     let nestedObj = nestedJSON;

          //     for (let i = 0; i < keys.length; i++) {
          //       const currentKey = toSnakeCase(keys[i]);
          //       if (i === keys.length - 1) {
          //         nestedObj[currentKey] = originalData[key];
          //       } else {
          //         nestedObj[currentKey] = nestedObj[currentKey] || {};
          //         nestedObj = nestedObj[currentKey];
          //       }
          //     }
          //   }
          //   return nestedJSON;
          // });

          dataset.value = data;
          initialized.value = true;
        }
      });
    });
  };

  const wealthByAgeGroup = computed(() => wealthByAgeGroupData(dataset.value));

  const get = (sourceType: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE]) => {
    switch (sourceType) {
    case DATA_SOURCE_TYPE.WEALTH_BY_AGE_GROUP:
      return wealthByAgeGroup.value;
    default:
      return dataset.value;
    }
  };

  return {
    dataset,
    load,
    initialized,
    get
  };
});
