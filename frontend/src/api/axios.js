import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', 
});

// This interceptor grabs the token from localStorage and attaches it to headers
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;