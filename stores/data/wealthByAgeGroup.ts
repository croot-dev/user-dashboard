interface WealthByAgeGroupItem {
  AgeGroup: number;
  Count: number;
  Sum: number;
}

export const wealthByAgeGroup = (source: any[] = []) => {
  const result: WealthByAgeGroupItem[] = source.reduce((accumulator, row) => {
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
  }, [] as WealthByAgeGroupItem[]);

  return result.sort((a, b) => a.AgeGroup > b.AgeGroup ? 1 : -1);
  // return [
  //   ...Array.from(result, ([name, value], index) => ({ AgeGroup: `${name}0대`, Index: index, Sum: value.toFixed(2) })).sort((a, b) => a.AgeGroup > b.AgeGroup ? 1 : -1)
  // ];
};
