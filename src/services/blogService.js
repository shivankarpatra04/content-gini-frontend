// src/services/blogService.js
import api from './api';

export const blogService = {
    generateBlog: async (blogData) => {
        const { data } = await api.post('/blog/generate', blogData);
        return data;
    },

    analyzeBlog: async (text) => {
        const { data } = await api.post('/blog/analyze', { text });
        return data;
    },
};