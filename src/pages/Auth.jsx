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
                await login({
                    email: formData.email,
                    password: formData.password
                });
                // Navigation is handled in AuthContext
            } else if (mode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match');
                    return;
                }
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                // Navigation is handled in AuthContext
            }
        } catch (error) {
            console.error('Auth error:', error);
            toast.error(error.message || 'Authentication failed');
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
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
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
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
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
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
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
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
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