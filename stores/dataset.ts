// @ts-nocheck
import { defineStore } from 'pinia';
import { parse } from 'papaparse';
import { wealthByAgeGroup } from './data/wealthByAgeGroup';
import { DATA_SOURCE_TYPE } from '~/constants';

export const useDatasetStore = defineStore('dataset', () => {
  const dataset = ref([]);
  const initialized = ref(false);
  const load = () => {
    initialized.value = false;
    return new Promise((resolve) => {
      parse('/dataset/billionaires.csv', {
        header: true,
        download: true,
        complete: ({ data }) => {
          dataset.value = data;
          initialized.value = true;
          resolve(data);
        }
      });
    });
  };

  const get = async (sourceType: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE]): Promise<any[]> => {
    const source = initialized.value ? dataset.value : await load();
    switch (sourceType) {
    case DATA_SOURCE_TYPE.WEALTH_BY_AGE_GROUP:
      return wealthByAgeGroup(source);
    default:
      return source;
    }
  };

  return {
    dataset,
    load,
    initialized,
    get
  };
});
