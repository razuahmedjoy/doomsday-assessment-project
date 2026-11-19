import { z } from 'zod';
import { idSchema } from './common.js';

const fields = {
  title: z.string().trim().min(1, 'title is required'),
  releaseYear: z.number().int().min(1888).max(2200),
  runtime: z.number().int().min(1).max(300),
  watched: z.boolean(),
  prerequisites: z.array(idSchema).transform((ids) => [...new Set(ids)]),
};

export const createMovieSchema = z.object({
  ...fields,
  watched: fields.watched.default(false),
  prerequisites: fields.prerequisites.default([]),
});

// PATCH: every field optional, no defaults, so missing fields stay unchanged.
export const updateMovieSchema = z.object(fields).partial();
