import fsDriver from 'unstorage/drivers/fs';

export default defineNitroPlugin(() => {
  const storage = useStorage();
  const driver = fsDriver({
    base: './server/db',
    watchOptions: {}
  });

  // Mount driver
  storage.mount('fs', driver);
});
