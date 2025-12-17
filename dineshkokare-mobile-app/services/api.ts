import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Platform } from 'react-native';

// Replace '192.168.1.2' with your computer's actual IP if it changes
const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
};
