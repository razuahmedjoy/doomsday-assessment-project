import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/HttpError.js';
import { minBundles } from '../lib/bundles.js';

export const listCinemas = () => prisma.cinema.findMany({ orderBy: { id: 'asc' } });

export const createCinema = (data) => prisma.cinema.create({ data });

export async function getBookingQuote(id, groupSize) {
  const cinema = await prisma.cinema.findUnique({ where: { id } });
  if (!cinema) throw new HttpError(404, 'NOT_FOUND', 'Cinema not found');

  const bundles = minBundles(cinema.bundleSizes, groupSize);
  return {
    cinema: { id: cinema.id, name: cinema.name },
    groupSize,
    possible: bundles !== null,
    totalBundles: bundles ? bundles.reduce((sum, b) => sum + b.count, 0) : null,
    bundles: bundles ?? [],
  };
}
