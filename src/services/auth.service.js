import { axiosPublic, axiosPrivate } from '../axios';
import config from '../config';

class AuthService {
    async login(username, password) {
        try {
            const response = await axiosPublic.post(config.API.AUTH.LOGIN, {
                username,
                password
            });

            const { token, refreshToken, user } = response.data;

            // Store tokens and user data
            localStorage.setItem(config.STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(config.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            localStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(user));

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async validateToken() {
        try {
            const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axiosPrivate.post(config.API.AUTH.VALIDATE, {
                token
            });

            return response.data;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(config.STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(config.STORAGE_KEYS.USER);
        window.location.href = config.ROUTES.LOGIN;
    }

    getCurrentUser() {
        const userStr = localStorage.getItem(config.STORAGE_KEYS.USER);
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    isAuthenticated() {
        return !!localStorage.getItem(config.STORAGE_KEYS.TOKEN);
    }
}

export default new AuthService(); 