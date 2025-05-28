import Keycloak from 'keycloak-js';
import { useAuthStore } from '../store/authStore';
import { extractRolesFromToken } from '@/utils/tokenUtils';


const keycloak = new Keycloak({
  url: 'http://localhost:9090',
  realm: 'pfe',
  clientId: 'pfe-front-client',
});

const initKeycloak = () =>
  new Promise<void>((resolve, reject) => {
    keycloak
      .init({ onLoad: 'login-required', pkceMethod: 'S256' })
      .then((authenticated) => {
        if (authenticated) {
          localStorage.setItem('token', keycloak.token!);
          console.log('token:', keycloak.token);
          localStorage.setItem('refreshToken', keycloak.refreshToken!);

          const roles = extractRolesFromToken(keycloak.token!);
          console.log('User roles:', roles);
          
          useAuthStore.getState().setToken(keycloak.token!);
          useAuthStore.getState().setRoles(roles);
          resolve();
        } else {
          reject("User not authenticated");
        }
      })
      .catch((error) => reject(error));
  });

const doLogout = () => {
  keycloak.logout();
};

const getKeycloakInstance = () => keycloak;

export { initKeycloak, doLogout, getKeycloakInstance };
