// src/components/common/Input.jsx
import React from 'react';

export const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500"
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};