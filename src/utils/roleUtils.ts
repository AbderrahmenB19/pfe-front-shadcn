import { useAuthStore } from '@/store/authStore';


export const hasRole = (allowedRoles: string[]): boolean => {
  const { roles } = useAuthStore.getState();
  return allowedRoles.some(role => roles.includes(role));
};


export const isAdmin = (): boolean => {
  return hasRole(['ADMIN']);
};


export const isValidator = (): boolean => {
  return hasRole(['VALIDATOR']);
};


export const isUser = (): boolean => {
  return hasRole(['USER']);
};