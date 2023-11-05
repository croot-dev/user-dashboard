import { defineStore } from "pinia";
import Papa from 'papaparse';
import { toSnakeCase } from "~/utils";

export const useDatasetStore = defineStore('dataset', () => {
  const dataset = ref()
  const initialized = ref(false)
  const load = async () => {
    initialized.value = false;
    return new Promise((resolve, reject) => {
      Papa.parse('/dataset/billionaires.csv', {
        header: true,
        download: true,
        complete({ data }) {
          const result = data.map((originalData) => {
            const nestedJSON = {};
            for (const key in originalData) {
              const keys = key.split('.');
              let nestedObj = nestedJSON;

              for (let i = 0; i < keys.length; i++) {
                const currentKey = toSnakeCase(keys[i]);
                if (i === keys.length - 1) {
                  nestedObj[currentKey] = originalData[key];
                } else {
                  nestedObj[currentKey] = nestedObj[currentKey] || {};
                  nestedObj = nestedObj[currentKey];
                }
              }
            }
            return nestedJSON;
          })
          
          dataset.value = result;
          initialized.value = true;
        }
      })
    })
  }


  const incomeByAgeGroup = computed(() => {
    const result = new Map();
    dataset.value.forEach((row) => {
      if (!row?.demographics?.age) {
        return;
      }
      const group = Math.floor(row.demographics.age / 10)
      if (group < 1) {
        return
      }
      const value = Number(row?.wealth?.worth_in_billions || 0);
      if (result.has(group)) {
        result.get(group) + value
      } else {
        result.set(group, value)
      }
    });
    return Array.from(result, ([name, value]) => ({ name: `${name}0대`, value })).sort((a,b) => (a.name > b.name)? 1: -1);
  })
  
  return { dataset, load, initialized, incomeByAgeGroup }
})