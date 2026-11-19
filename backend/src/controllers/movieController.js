import * as movieService from '../services/movieService.js';
import { sendResponse } from '../utils/sendResponse.js';
import { idSchema } from '../validators/common.js';
import { createMovieSchema, updateMovieSchema } from '../validators/movieValidator.js';

export async function list(req, res) {
  const movies = await movieService.listMovies();
  sendResponse(res, { message: 'Movies retrieved', data: movies });
}

export async function create(req, res) {
  const movieData = createMovieSchema.parse(req.body);
  const movie = await movieService.createMovie(movieData);
  sendResponse(res, { statusCode: 201, message: 'Movie created', data: movie });
}

export async function update(req, res) {
  const id = idSchema.parse(req.params.id);
  const movie = await movieService.updateMovie(id, updateMovieSchema.parse(req.body));
  sendResponse(res, { message: 'Movie updated', data: movie });
}

export async function rewatchOrder(req, res) {
  const plan = await movieService.getRewatchPlan(idSchema.parse(req.params.id));
  sendResponse(res, { message: 'Rewatch order retrieved', data: plan });
}
