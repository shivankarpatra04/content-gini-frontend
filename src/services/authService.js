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

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Don't add token for auth requests
        if (!config.url.includes('/auth/')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config.url.includes('/auth/');

        // Handle 401 errors
        if (error.response?.status === 401) {
            if (!isAuthRequest) {
                // Only clear auth and redirect for non-auth requests
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                window.location.href = '/auth?mode=login';
            }
            // For auth requests, just reject the promise
            return Promise.reject(error);
        }

        // Handle other errors
        console.error('API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config.url
        });

        return Promise.reject(error);
    }
);

export const authService = {
    login: async ({ email, password }) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Invalid email or password');
            }
            throw new Error(error.response?.data?.message || 'Login failed');
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