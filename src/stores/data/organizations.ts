import { parse } from 'papaparse';

export const defaultDataset = () => {
  return new Promise((resolve, reject) => {
    parse('/dataset/organizations-100.csv', {
      header: true,
      download: true,
      complete: ({ data }) => {
        resolve(data);
      },
      error: reject
    });
  });
};
