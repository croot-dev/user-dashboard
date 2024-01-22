// @ts-nocheck
import { defineStore } from 'pinia';
import { wealthByAgeGroup } from './data/wealthByAgeGroup';
import { defaultDataset } from './data/organizations';
import { DATA_SOURCE_TYPE } from '~/constants';

export const useDatasetStore = defineStore('dataset', () => {
  const get = (sourceType: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE]): Promise<any[]> => {
    switch (sourceType) {
    case DATA_SOURCE_TYPE.WEALTH_BY_AGE_GROUP:
      return wealthByAgeGroup();
    default:
      return defaultDataset();
    }
  };

  return {
    get
  };
});
