import { api } from './client.js';

export const listMovies = () => api.get('/movies');
export const createMovie = (movie) => api.post('/movies', movie);
export const updateMovie = (id, changes) => api.patch(`/movies/${id}`, changes);
export const getRewatchPlan = (id) => api.get(`/movies/${id}/rewatch-order`);
