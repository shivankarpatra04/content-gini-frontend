// src/services/authService.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Important for handling cookies if you're using them
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if this is a login attempt
        const isLoginRequest = error.config.url.includes('/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            // Only handle 401s for non-login requests
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async ({ email, password }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            console.error('Login error:', error);
            throw new Error(message);
        }
    },

    register: async ({ name, email, password }) => {
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            console.error('Registration error:', error);
            throw new Error(message);
        }
    },

    getCurrentUser: async () => {
        try {
            const userData = localStorage.getItem('userData');
            if (!userData) return null;

            // Optionally verify token with backend
            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem('userData');
                return null;
            }

            // You can add an API call here to verify the token
            return JSON.parse(userData);
        } catch (error) {
            console.error('Get current user error:', error);
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            return null;
        }
    },

    logout: async () => {
        try {
            // Optional: Call backend to invalidate token
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            console.error('Forgot password error:', error);
            throw new Error(message);
        }
    },

    resetPassword: async ({ token, newPassword }) => {
        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                password: newPassword
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password';
            console.error('Reset password error:', error);
            throw new Error(message);
        }
    },

    // Add method to check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;