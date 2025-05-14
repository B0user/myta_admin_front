import axios from 'axios';
import config from './config';

// Create axios instance for public requests
export const axiosPublic = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Create axios instance for private requests
export const axiosPrivate = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
axiosPrivate.interceptors.request.use(
    (conf) => {
        const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
        if (token) {
            conf.headers.Authorization = `Bearer ${token}`;
        }
        return conf;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(config.STORAGE_KEYS.REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to refresh the token
                const response = await axiosPublic.post(config.API.AUTH.REFRESH, {
                    refreshToken
                });

                const { token, refreshToken: newRefreshToken } = response.data;

                // Store new tokens
                localStorage.setItem(config.STORAGE_KEYS.TOKEN, token);
                localStorage.setItem(config.STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;

                // Retry the original request
                return axiosPrivate(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
                localStorage.removeItem(config.STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(config.STORAGE_KEYS.USER);
                window.location.href = config.ROUTES.LOGIN;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 