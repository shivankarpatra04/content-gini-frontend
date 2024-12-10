// src/utils/validators.js
export const validators = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    password: (password) => {
        return password.length >= 8;
    },

    name: (name) => {
        return name.length >= 2;
    },
};