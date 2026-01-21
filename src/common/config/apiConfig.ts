const env = import.meta.env ?? {};
export const API_BASE_URL =
  env.VITE_API_BASE_URL ?? 'https://mobile-test.fkb.kg/admin-panel/api/v1';

export const KEYCLOAK_BASE_URL =
  'https://mobile-test.fkb.kg/keycloak/realms/admin-panel/protocol/openid-connect';

export const PROXY_BASE_URL = 'https://mobile-test.fkb.kg';
