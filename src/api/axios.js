import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 405) {
            console.error('Method not allowed:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;
