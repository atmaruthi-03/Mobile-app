import axios from 'axios';
import { ENV } from '../constants/env';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../utils/token.storage';
import { refreshAccessToken } from './refresh.service';

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops and skip for login
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
          // Attempt to refresh token
          const data = await refreshAccessToken(refreshToken);

          if (data.access_token && data.refresh_token) {
            // Save new tokens
            await saveTokens(data.access_token, data.refresh_token);

            // Update header and retry original request
            api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed (token expired or invalid)
        await clearTokens();
      }
    }

    // Return original error if refresh failed or other error occurred
    return Promise.reject(error);
  }
);

export default api;
