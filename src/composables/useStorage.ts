import CryptoJS from 'crypto-js';

interface UseStorageOption {
  secretKey?: string;
  expired?: number | null;
  hasher?: 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';
  algorithm?: 'AES' | 'DES' | 'TripleDES' | 'RC4' | 'RC4Drop' | 'Rabbit';
}

/**
 * 암호화 된 스토리지 훅
 * @param $storage 사용할 스토리지
 * @param options 기타 사용 옵션
 * @returns storage
 */
export const useStorage = (
  $storage: Storage = localStorage,
  options?: UseStorageOption
) => {
  const secretKey = options?.secretKey || process.env.STORAGE_SECRET_KEY || 'default-storage-secret-key';
  const _hash = (plainText: string): string => {
    const bytes = CryptoJS.SHA512(plainText);
    return bytes.toString();
  };
  const _encrypt = (plainText: string): string => {
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
  };
  const _decrypt = (cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const storage = () => {
    const getItem = (key: string) => {
      const value = $storage.getItem(_hash(key));
      return value ? _decrypt(value) : value;
    };
    const setItem = (key: string, data: string) => {
      return $storage.setItem(_hash(key), _encrypt(data));
    };
    const removeItem = (key: string) => {
      return $storage.removeItem(_hash(key));
    };

    return {
      getItem,
      setItem,
      removeItem,
      key: $storage.key,
      clear: $storage.clear,
      length: $storage.length
    };
  };
  return {
    storage: storage()
  };
};
