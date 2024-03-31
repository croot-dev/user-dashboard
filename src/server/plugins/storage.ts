import fsDriver from 'unstorage/drivers/fs';

export default defineNitroPlugin(() => {
  const storage = useStorage();
  const driver = fsDriver({
    base: process.env.FS_BASE,
    watchOptions: {}
  });

  // Mount driver
  // storage.mount('fs', driver);
});
