import { z } from 'zod';
import { imageSchema } from './image';
import { casterSchema } from './caster';
import { broadcasterSchema } from './broadcaster';
import { coverageSchema } from './coverage';

export const tournamentSchema = z.object({
  id: z.number(),
  title: z.string(),
  shortTitle: z.string(),
  tier: z.number(),
  copy: z
    .object({
      generalDescription: z.string().optional().nullable(),
      shortDescription: z.string().optional().nullable(),
      formatDescription: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  links: z
    .object({
      website: z.string().optional().nullable(),
      wiki: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  start: z.number(),
  end: z.number(),
  gameId: z.number(),
  prizePool: z
    .object({
      total: z.string().optional().nullable(),
      first: z.string().optional().nullable(),
      second: z.string().optional().nullable(),
      third: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  location: z
    .object({
      host: z
        .object({
          id: z.number(),
          name: z.string(),
          abbreviation: z.string(),
          country: z
            .object({
              id: z.number(),
              name: z.string(),
              abbreviation: z.string(),
              images: z.array(imageSchema).optional(),
            })
            .optional()
            .nullable(),
        })
        .optional()
        .nullable(),
      participants: z.array(z.any()).optional().nullable(), // Adjust as needed
    })
    .optional()
    .nullable(),
  deletedAt: z.number().optional().nullable(),
  images: z.array(imageSchema).optional().nullable(),
  stageIds: z.array(z.number()).optional().nullable(),
  casters: z.array(casterSchema).optional().nullable(),
  broadcasters: z.array(broadcasterSchema).optional().nullable(),
  defaults: z
    .object({
      gameVersion: z.string().nullable().optional(),
    })
    .optional()
    .nullable(),
  coverage: coverageSchema.optional().nullable(),
  resourceVersion: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Tournament = z.infer<typeof tournamentSchema>;
