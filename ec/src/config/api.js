// API Configuration
// Change this to your deployed API URL when deploying
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const PRODUCT_API = {
    getAll: `${API_BASE_URL}/api/products`,
    getById: (id) => `${API_BASE_URL}/api/products/${id}`,
    create: `${API_BASE_URL}/api/products`,
    update: (id) => `${API_BASE_URL}/api/products/${id}`,
    delete: (id) => `${API_BASE_URL}/api/products/${id}`,
};

export const AUTH_API = {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
};
