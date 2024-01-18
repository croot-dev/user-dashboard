import type { DatasetComponentOption } from 'echarts';

export const wealthByAgeGroupData = (source: DatasetComponentOption['source'] = []) => {
  const result = new Map();
  (source as any[]).forEach((row) => {
    if (!row?.demographics?.age) {
      return;
    }
    const group = Math.floor(row.demographics.age / 10);
    if (group < 1) {
      return;
    }
    const value = Number(row?.wealth?.worth_in_billions || 0);
    if (result.has(group)) {
      // const sample = result.get(group) + value
    } else {
      result.set(group, value);
    }
  });

  return [
    ['AgeGroup', 'Sum'],
    ...Array.from(result, ([name, value]) => [`${name}0대`, value])
  ];
};
