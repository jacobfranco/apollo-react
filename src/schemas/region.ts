import { z } from 'zod';

export const regionSchema = z.object({
  id: z.number().nullable().optional(),           // Allows `id` to be a number or null/undefined
  name: z.string().nullable().optional(),         // Allows `name` to be a string or null/undefined
  abbreviation: z.string().nullable().optional(), // Allows `abbreviation` to be a string or null/undefined
  country: z.object({ /* add fields as needed */ }).nullable().optional(), // Allows `country` to be an object or null/undefined
});

export type Region = z.infer<typeof regionSchema>;
