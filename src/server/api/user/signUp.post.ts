import { Tab } from '~/types';
import { generateKey } from '~/utils';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const storage = useStorage('redis');
  const userData = {
    userId: body.userId,
    userName: body.userName,
    userPassword: body.userPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await storage.setItem(body.userId, userData);

  return true;
});
