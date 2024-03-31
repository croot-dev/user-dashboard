export default defineEventHandler(async (event) => {
  const storage = useStorage('redis');
  const data = await storage.getItem('dashboard');
  return data;
});
