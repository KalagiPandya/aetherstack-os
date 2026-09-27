import axios from 'axios';

// Create an Axios instance pointing to our backend server
// Automatically uses production URL (VITE_API_URL) when deployed, or defaults to local server
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Automatically attach the JWT token to every outgoing request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('devflow_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
