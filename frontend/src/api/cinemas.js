import { api } from './client.js';

export const listCinemas = () => api.get('/cinemas');
export const createCinema = (cinema) => api.post('/cinemas', cinema);
export const getBookingQuote = (id, groupSize) => api.get(`/cinemas/${id}/booking`, { params: { groupSize } });
