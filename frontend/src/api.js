import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
            // IMPORTANT: Standard "Bearer " prefix is required
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
});

export default API;