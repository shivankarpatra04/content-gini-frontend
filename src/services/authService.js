// src/services/authService.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    // Login endpoint
    login: async ({ email, password }) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    // Register endpoint
    register: async ({ name, email, password }) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    // Get current user
    getCurrentUser: async () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    // Forgot password endpoint
    forgotPassword: async (email) => {
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send reset email');
        }
    },

    // Reset password endpoint - This needs to be modified
    resetPassword: async ({ token, newPassword }) => {
        try {
            // Changed the endpoint to include token in URL
            const { data } = await api.post(`/auth/reset-password/${token}`, {
                password: newPassword // Changed to match backend expectation
            });
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to reset password');
        }
    },
};