// src/components/common/Button.jsx
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const Button = ({
    children,
    loading = false,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors
        ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
        text-white disabled:opacity-50 ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? <LoadingSpinner /> : children}
        </button>
    );
};