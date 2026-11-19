// Loads the sample data on first start. Skips if the database already has movies.
import { prisma } from '../src/config/prisma.js';
import { seedSampleData } from '../src/services/seedService.js';

if ((await prisma.movie.count()) === 0) {
  await seedSampleData();
  console.log('Seeded sample data');
}
await prisma.$disconnect();
