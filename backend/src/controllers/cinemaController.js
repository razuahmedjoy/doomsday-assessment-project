import * as cinemaService from '../services/cinemaService.js';
import { sendResponse } from '../utils/sendResponse.js';
import { idSchema } from '../validators/common.js';
import { bookingQuerySchema, createCinemaSchema } from '../validators/cinemaValidator.js';

export async function list(req, res) {
  const cinemas = await cinemaService.listCinemas();
  sendResponse(res, { message: 'Cinemas retrieved', data: cinemas });
}

export async function create(req, res) {
  const cinema = await cinemaService.createCinema(createCinemaSchema.parse(req.body));
  sendResponse(res, { statusCode: 201, message: 'Cinema created', data: cinema });
}

export async function booking(req, res) {
  const id = idSchema.parse(req.params.id);
  const { groupSize } = bookingQuerySchema.parse(req.query);
  const quote = await cinemaService.getBookingQuote(id, groupSize);
  sendResponse(res, { message: 'Booking quote calculated', data: quote });
}
