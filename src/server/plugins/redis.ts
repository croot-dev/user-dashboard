import redisDriver from 'unstorage/drivers/redis';

export default defineNitroPlugin(() => {
  const storage = useStorage();
  const config = useRuntimeConfig().redis;

  // Mount driver
  storage.mount('user', redisDriver({
    base: 'user',
    host: config.host,
    port: parseInt(config.port) as number,
    username: config.username,
    password: config.password,
    db: (config.db || 0) as number
  }));
  storage.mount('dashboard', redisDriver({
    base: 'dashboard',
    host: config.host,
    port: parseInt(config.port) as number,
    username: config.username,
    password: config.password,
    db: (config.db || 0) as number
  }));
});
