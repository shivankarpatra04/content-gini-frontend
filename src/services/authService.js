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

// Request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // Don't add token for login/register requests
        if (!config.url.includes('/auth/')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Get the original request configuration
        const originalRequest = error.config;

        // Check if this is an authentication request (login/register)
        const isAuthRequest = originalRequest.url.includes('/auth/');

        // Handle different error scenarios
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Only handle unauthorized errors for non-auth requests
                    if (!isAuthRequest) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userData');
                        window.location.href = '/auth?mode=login';
                    }
                    break;

                case 403:
                    // Handle forbidden errors
                    console.error('Forbidden access:', error);
                    break;

                case 404:
                    // Handle not found errors
                    console.error('Resource not found:', error);
                    break;

                case 500:
                    // Handle server errors
                    console.error('Server error:', error);
                    break;

                default:
                    // Handle other errors
                    console.error('API error:', error);
                    break;
            }
        } else if (error.request) {
            // Handle network errors
            console.error('Network error:', error);
        } else {
            // Handle other errors
            console.error('Error:', error);
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