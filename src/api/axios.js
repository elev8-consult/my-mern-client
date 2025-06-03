import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://my-mern-server-production.up.railway.app'
    : process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
