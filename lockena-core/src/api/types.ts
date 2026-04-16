export interface ApiConfig {
  getToken: () => string | null;
  refreshToken: () => Promise<boolean>;
}
