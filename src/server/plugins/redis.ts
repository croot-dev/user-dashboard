import redisDriver from 'unstorage/drivers/redis';

export default defineNitroPlugin(() => {
  const storage = useStorage();
  const config = useRuntimeConfig().redis;
  // Dynamically pass in credentials from runtime configuration, or other sources
  const driver = redisDriver({
    base: 'redis',
    host: config.host,
    port: parseInt(config.port) as number,
    username: config.username,
    password: config.password,
    db: (config.db || 0) as number
  });

  // Mount driver
  storage.mount('redis', driver);
});
