
export const decodeToken = (token: string): any => {
  try {
   
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


export const extractRolesFromToken = (token: string): string[] => {
  const decoded = decodeToken(token);
  if (!decoded) return [];
  

  return decoded.realm_access?.roles || [];
};