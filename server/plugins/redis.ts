import redisDriver from 'unstorage/drivers/redis';

export default defineNitroPlugin(() => {
  const storage = useStorage();

  // Dynamically pass in credentials from runtime configuration, or other sources
  const driver = redisDriver({
    base: '',
    host: useRuntimeConfig().redis.host,
    port: parseInt(useRuntimeConfig().redis.port) as number,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: (process.env.REDIS_DB || 0) as number
  });

  // Mount driver
  storage.mount('redis', driver);
});
