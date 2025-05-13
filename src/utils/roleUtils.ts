// src/utils/roleUtils.ts
import { useAuthStore } from '@/store/authStore';

/**
 * Check if the current user has any of the specified roles
 * @param allowedRoles Array of roles to check against
 * @returns Boolean indicating if user has any of the allowed roles
 */
export const hasRole = (allowedRoles: string[]): boolean => {
  const { roles } = useAuthStore.getState();
  return allowedRoles.some(role => roles.includes(role));
};

/**
 * Check if the current user has the admin role
 * @returns Boolean indicating if user is an admin
 */
export const isAdmin = (): boolean => {
  return hasRole(['ADMIN']);
};

/**
 * Check if the current user has the validator role
 * @returns Boolean indicating if user is a validator
 */
export const isValidator = (): boolean => {
  return hasRole(['VALIDATOR']);
};

/**
 * Check if the current user has the user role
 * @returns Boolean indicating if user is a regular user
 */
export const isUser = (): boolean => {
  return hasRole(['USER']);
};