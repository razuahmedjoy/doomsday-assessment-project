import { create } from 'zustand';
import * as moviesApi from '../api/movies.js';

// Shared by the Movies and Rewatch Plan pages so both always show the same data.
export const  useMovieStore = create((set) => ({
  movies: [],

  fetchMovies: async () => set({ movies: await moviesApi.listMovies() }),

  addMovie: async (movie) => {
    const created = await moviesApi.createMovie(movie);
    set((state) => ({ movies: [...state.movies, created] }));
  },

  updateMovie: async (id, changes) => {
    const updated = await moviesApi.updateMovie(id, changes);
    set((state) => ({ movies: state.movies.map((m) => (m.id === id ? updated : m)) }));
  },
}));
