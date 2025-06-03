import axios from 'axios';

const baseURL =process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL,
    withCredentials: false, // Changed to match server CORS configuration
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
