import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/HttpError.js';
import { rewatchOrder, wouldCreateCycle } from '../lib/graph.js';

const includePrereqIds = { prerequisites: { select: { id: true } } };

// API shape: prerequisites as a plain list of movie ids.
const toDto = ({ prerequisites, ...movie }) => ({ ...movie, prerequisites: prerequisites.map((p) => p.id) });

// Prisma relation references: ['id-1'] -> [{ id: 'id-1' }]
const toRefs = (ids) => ids.map((id) => ({ id }));

async function findAllMovies(db = prisma) {
  const movies = await db.movie.findMany({ include: includePrereqIds, orderBy: { id: 'asc' } });
  return movies.map(toDto);
}

// One query: if fewer movies are found than ids given, at least one id is unknown.
async function assertMoviesExist(ids, db) {
  const found = await db.movie.count({ where: { id: { in: ids } } });
  if (found !== ids.length) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Every prerequisite must be an existing movie');
  }
}

export const listMovies = () => findAllMovies();

export async function createMovie({ prerequisites, ...data }) {
  // A new movie has no dependents yet, so it cannot be part of a cycle.
  await assertMoviesExist(prerequisites, prisma);
  const movie = await prisma.movie.create({
    data: { ...data, prerequisites: { connect: toRefs(prerequisites) } },
    include: includePrereqIds,
  });
  return toDto(movie);
}

export async function updateMovie(id, { prerequisites, ...data }) {
  // Serializable, so two concurrent updates cannot each pass the cycle check and together form a cycle.
  const movie = await prisma.$transaction(
    async (tx) => {
      const movies = await findAllMovies(tx);
      if (!movies.some((m) => m.id === id)) throw new HttpError(404, 'NOT_FOUND', 'Movie not found');

      if (prerequisites) {
        await assertMoviesExist(prerequisites, tx);
        const graph = new Map(movies.map((m) => [m.id, m.prerequisites]));
        if (wouldCreateCycle(graph, id, prerequisites)) {
          throw new HttpError(409, 'CIRCULAR_DEPENDENCY', 'A movie cannot depend on itself, directly or indirectly');
        }
      }

      return tx.movie.update({
        where: { id },
        // `set` replaces the whole prerequisite list.
        data: { ...data, ...(prerequisites && { prerequisites: { set: toRefs(prerequisites) } }) },
        include: includePrereqIds,
      });
    },
    { isolationLevel: 'Serializable' },
  );
  return toDto(movie);
}

export async function getRewatchPlan(id) {
  const movies = await findAllMovies();
  const byId = new Map(movies.map((m) => [m.id, m]));
  const target = byId.get(id);
  if (!target) throw new HttpError(404, 'NOT_FOUND', 'Movie not found');

  const graph = new Map(movies.map((m) => [m.id, m.prerequisites]));
  const order = rewatchOrder(graph, id).map((movieId) => byId.get(movieId));
  const unwatched = order.filter((m) => !m.watched);

  return {
    target: { id: target.id, title: target.title },
    order,
    totalCount: order.length,
    watchedCount: order.length - unwatched.length,
    remainingRuntime: unwatched.reduce((sum, m) => sum + m.runtime, 0),
  };
}
