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
            if (loading) {
                return 'Signing in...'
            }
            if (mode === 'login') {
                const success = await login({
                    email: formData.email,
                    password: formData.password
                });

                if (!success) {
                    setLoading(false);
                    return; // Stop here if login failed
                }
                // Navigation is handled in login function
            } else if (mode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match');
                    setLoading(false);
                    return;
                }

                const success = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (!success) {
                    setLoading(false);
                    return;
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/60 to-slate-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-card border border-slate-100">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {mode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {mode === 'login'
                            ? 'Sign in to continue creating with Content Gini.'
                            : 'Start generating and analyzing content in seconds.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {formErrors.general && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{formErrors.general}</span>
                        </div>
                    )}
                    {mode === 'register' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required={mode === 'register'}
                                className={`mt-1 block w-full rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-slate-300'
                                    } px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition`}
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
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={`mt-1 block w-full rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-slate-300'
                                } px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition`}
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
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={`mt-1 block w-full rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-slate-300'
                                } px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition`}
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
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required={mode === 'register'}
                                className={`mt-1 block w-full rounded-lg border ${formErrors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                                    } px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition`}
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
                        className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (mode === 'login' ? 'Signing in...' : 'Signing up...') : mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    {mode === 'login' ? (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="font-medium text-brand-600 hover:text-brand-700"
                            >
                                Forgot your password?
                            </button>
                            <div className="mt-2">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="font-medium text-brand-600 hover:text-brand-700"
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
                                className="font-medium text-brand-600 hover:text-brand-700"
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