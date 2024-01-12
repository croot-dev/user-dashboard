import { Tab } from '~/types';

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

const generateKey = (length: number):string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet.charAt(randomIndex);
  }

  return result;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const storage = useStorage('fs');
  const newDashboardId = generateKey(5);
  const newDashboard: Tab.Item = Object.assign({}, DASHBOARD_TEMPLATE, { id: newDashboardId, title: body.title || 'Noname' });
  const origin: Tab.Item[] = await storage.getItem<Tab.Item[]>('dashboard') || [];
  origin.push(newDashboard);
  await storage.setItem('dashboard', origin);
  return newDashboard;
});
