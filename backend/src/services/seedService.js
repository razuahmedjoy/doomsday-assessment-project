import { prisma } from '../config/prisma.js';
import { sampleCinemas, sampleMovies } from '../data/sampleData.js';

// Inserts the sample movies and cinemas. `db` is the Prisma client or a transaction.
export async function seedSampleData(db = prisma) {
  // Movies are created in order, so every prerequisite already exists when it is connected.
  for (const { prerequisites, ...movie } of sampleMovies) {
    await db.movie.create({
      data: { ...movie, prerequisites: { connect: prerequisites.map((title) => ({ title })) } },
    });
  }
  await db.cinema.createMany({ data: sampleCinemas });
}

// Deletes all data and loads the sample data again, in one transaction.
export async function resetToSampleData() {
  await prisma.$transaction(async (tx) => {
    await tx.movie.deleteMany(); // prerequisite links are removed with their movies
    await tx.cinema.deleteMany();
    await seedSampleData(tx);
  });
}
