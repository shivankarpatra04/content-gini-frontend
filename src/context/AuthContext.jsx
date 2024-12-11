// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check for existing user on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');

            if (token && userData && userData !== 'undefined') {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            }
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            const userData = {
                id: data.userId,
                email: credentials.email,
            };
            setUser(userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            toast.success('Login successful!');
            navigate('/blog-generator');
        } catch (error) {
            // Don't throw the error again, let it be handled by the calling function
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            toast.success('Registration successful!');
            navigate('/blog-generator');
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setUser(null);

            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Logout failed');
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            // Call your auth service
            await authService.forgotPassword(email);
            toast.success('Password reset email sent successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to send reset email');
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            await authService.resetPassword(token, newPassword);
            toast.success('Password reset successful');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Failed to reset password');
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
