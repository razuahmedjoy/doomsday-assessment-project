import { api } from './client.js';

export const resetDatabase = () => api.post('/admin/reset');
