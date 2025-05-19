// web-app/shared/schema.ts
import { z } from "zod";

export const insertSurveyResponseSchema = z.object({
  userId: z.string(),
  mood: z.string(),
  stressLevel: z.number().min(0).max(10),
  notes: z.string().optional(),
});
