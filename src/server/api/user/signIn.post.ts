import { Tab } from '~/types';
import { generateKey } from '~/utils';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userName = getRouterParam(event, 'userName');
  const password = getRouterParam(event, 'password');

  const storage = useStorage('redis');
  const users = await storage.getItem('user');

  console.log(users);

  return true;
});
