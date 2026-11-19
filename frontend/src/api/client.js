import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

// The API wraps results as { success, message, data }.
// Resolve with `data`; reject with the API's error message.
api.interceptors.response.use(
  (response) => response.data.data,
  (error) => Promise.reject(new Error(error.response?.data?.message ?? error.message)),
);
