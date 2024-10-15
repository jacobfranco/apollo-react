import { z } from 'zod'

export const dateStringOrNumber = z.union([z.string(), z.number()]).nullable();
