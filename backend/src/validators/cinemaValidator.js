import { z } from 'zod';

export const createCinemaSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  bundleSizes: z
    .array(z.number().int().min(1).max(500))
    .min(1)
    .max(10)
    .refine((sizes) => new Set(sizes).size === sizes.length, 'bundle sizes must be different')
    .transform((sizes) => sizes.toSorted((a, b) => a - b)),
});

export const bookingQuerySchema = z.object({
  groupSize: z.coerce.number().int().min(1).max(10_000),
});
