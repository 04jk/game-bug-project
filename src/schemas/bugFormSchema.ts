
import { z } from 'zod';
import { BugSeverity } from '@/types/bug';

export const bugFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  stepsToReproduce: z.string().min(10, {
    message: "Steps to reproduce must be at least 10 characters.",
  }),
  severity: z.nativeEnum(BugSeverity),
  gameArea: z.string().min(1, {
    message: "Game area is required.",
  }),
  platform: z.string().min(1, {
    message: "Platform is required.",
  }),
});

export type BugFormData = z.infer<typeof bugFormSchema>;
