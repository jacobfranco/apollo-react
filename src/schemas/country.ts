import { z } from 'zod';
import { ImageSchema } from './image';

export const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
  images: z.array(ImageSchema),
});

export type Country = z.infer<typeof CountrySchema>;
