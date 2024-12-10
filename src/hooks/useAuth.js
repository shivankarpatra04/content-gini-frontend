// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return {
        user: context.user,
        loading: context.loading,
        isAuthenticated: context.isAuthenticated,
        login: context.login,
        register: context.register,
        logout: context.logout,
        forgotPassword: context.forgotPassword
    };
};
export default useAuth;
