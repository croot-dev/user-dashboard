import { Tab } from '~/types';
import { generateKey } from '~/utils';
import { Response, STATUS_CODES } from '~/server/util/Response';
import { verifyToken } from '~/server/util/token';

const DASHBOARD_TEMPLATE: Tab.Item = {
  id: '',
  title: '',
  globalSetting: {
    startDate: '',
    endDate: '',
    autoReload: false
  },
  widgets: []
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = event.headers.get('Authorization');
  if (!token) {
    throw createError({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      statusMessage: 'Unauthorized'
    });
  }

  const { userName } = verifyToken(token.split(' ')[1])!;
  const storage = useStorage('dashboard');
  const newDashboard: Tab.Item = Object.assign(
    {},
    DASHBOARD_TEMPLATE,
    { id: generateKey(5), title: body.title || 'Noname' }
  );
  const origin: Tab.Item[] = await storage.getItem<Tab.Item[]>(userName) || [];
  origin.push(newDashboard);
  await storage.setItem(userName, origin);
  return new Response(newDashboard);
});
