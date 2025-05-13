// src/utils/tokenUtils.ts

/**
 * Decodes a JWT token and returns its payload
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): any => {
  try {
    // JWT tokens are made of three parts: header.payload.signature
    // We only need the payload part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Extracts roles from a Keycloak token
 * @param token JWT token string
 * @returns Array of roles or empty array if none found
 */
export const extractRolesFromToken = (token: string): string[] => {
  const decoded = decodeToken(token);
  if (!decoded) return [];
  
  // Keycloak stores roles in realm_access.roles
  return decoded.realm_access?.roles || [];
};