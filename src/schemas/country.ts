import { z } from 'zod';
import { imageSchema } from './image';

export const countrySchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
  images: z.array(imageSchema),
});

export type Country = z.infer<typeof countrySchema>;
