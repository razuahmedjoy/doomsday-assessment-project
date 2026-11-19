import { z } from 'zod';

// Movie and cinema ids are UUIDs.
export const idSchema = z.uuid({ error: 'id must be a valid UUID' });
