import { ROUTE } from '~/constants';

export default defineNuxtRouteMiddleware((to, from) => {
  const { storage } = useStorage();
  const accessToken = storage.getItem('accessToken');
  if (!accessToken) {
    return navigateTo(ROUTE.SIGNIN);
  }
});
