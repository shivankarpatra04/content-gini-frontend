// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Auth = () => {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState(searchParams.get('mode') || 'login');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Add this near your other state declarations
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
        general: ''
    });

    const clearErrors = (field) => {
        setFormErrors(prev => ({
            ...prev,
            [field]: '',
            general: ''
        }));
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                try {
                    await login({
                        email: formData.email,
                        password: formData.password
                    });
                    // Navigation is handled in AuthContext
                } catch (error) {
                    if (error.response?.status === 401) {
                        toast.error('Invalid email or password');
                    } else if (error.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error('Login failed. Please try again.');
                    }
                    // Remove the throw error here
                }
            } else if (mode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match');
                    return;
                }
                try {
                    await register({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    });
                } catch (error) {
                    if (error.response?.status === 409) {
                        toast.error('Email already exists');
                    } else if (error.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error('Registration failed. Please try again.');
                    }
                    // Remove the throw error here
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {formErrors.general && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{formErrors.general}</span>
                        </div>
                    )}
                    {mode === 'register' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required={mode === 'register'}
                                className={`mt-1 block w-full rounded-md border ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                    } p-2`}
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    clearErrors('name');
                                }}
                            />
                            {formErrors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formErrors.name}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={`mt-1 block w-full rounded-md border ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                clearErrors('email');
                            }}
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {formErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={`mt-1 block w-full rounded-md border ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                clearErrors('password');
                            }}
                        />
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {formErrors.password}
                            </p>
                        )}
                    </div>

                    {mode === 'register' && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required={mode === 'register'}
                                className={`mt-1 block w-full rounded-md border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } p-2`}
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    clearErrors('confirmPassword');
                                }}
                            />
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    {mode === 'login' ? (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Forgot your password?
                            </button>
                            <div className="mt-2">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="text-blue-600 hover:text-blue-500"
                                >
                                    Sign up
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;