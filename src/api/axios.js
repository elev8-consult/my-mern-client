import axios from 'axios';

const baseURL =process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL,
    withCredentials: false, // Changed to match server CORS configuration
    headers: {
        'Content-Type': 'application/json'
    }
});
export default api;
