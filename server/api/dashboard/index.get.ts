export default defineEventHandler(async (event) => {
  const storage = useStorage('fs');
  const data = await storage.getItem('dashboard');
  return data;
});
