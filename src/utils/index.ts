import deepmerge from 'deepmerge';

export const deepMerge = deepmerge;

export const toSnakeCase = (str: string) => {
  return str.replace(/ /g, '_').replace(/([A-Z])/g, $1 => ('_' + $1.toLowerCase()));
};

export const generateKey = (length: number):string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet.charAt(randomIndex);
  }

  return result;
};
