import { parse } from 'papaparse';

interface WealthByAgeGroupItem {
  AgeGroup: string;
  Count: number;
  Sum: number;
}

export const wealthByAgeGroup = () => {
  return new Promise((resolve, reject) => {
    parse('/dataset/billionaires.csv', {
      header: true,
      download: true,
      complete: ({ data }) => {
        const result = data.reduce((accumulator: WealthByAgeGroupItem[], row: any) => {
          const group = Math.floor(row['demographics.age'] / 10);
          if (group > 0) {
            const value = Number(row['wealth.worth in billions'] || 0);
            const groupIndex = accumulator.findIndex(({ AgeGroup }: WealthByAgeGroupItem) => AgeGroup === group + '0대');
            if (groupIndex > -1) {
              accumulator[groupIndex].Count += 1;
              accumulator[groupIndex].Sum = Number((accumulator[groupIndex].Sum + value).toFixed(2));
            } else {
              accumulator.push({
                AgeGroup: group + '0대',
                Count: 1,
                Sum: Number(value.toFixed(2))
              });
            }
          }

          return accumulator;
        }, []);

        resolve(result.sort((a, b) => a.AgeGroup > b.AgeGroup ? 1 : -1));
      },
      error: reject

    });
  });
};
