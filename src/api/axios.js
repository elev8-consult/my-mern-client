import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://my-mern-server-production.up.railway.app'
    : process.env.REACT_APP_API_URL || 'http://localhost:4000';

console.log('Current environment:', process.env.NODE_ENV);
console.log('API base URL:', baseURL);

const api = axios.create({
    baseURL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default api;
