import { z } from "zod";

export const lessonPhaseSchema = z.object({
  phaseName: z.string().default(""),
  duration: z.union([z.number(), z.string()]).default(""),
  teacherActivity: z.string().default(""),
  studentActivity: z.string().default(""),
  phaseMaterials: z.string().optional(),
  evaluationType: z.string().default(""),
  expectedOutputs: z.string().optional(),
});

export const lessonContentSchema = z.object({
  title: z.string().optional(),
  subject: z.string().optional(),
  level: z.string().optional(),
  pedagogicalApproach: z.string().optional(),
  competencies: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  didacticMaterials: z.array(z.string()).default([]),
  lessonProcess: z.array(lessonPhaseSchema).default([]),
  homework: z.string().default(""),
});

export type LessonPhase = z.infer<typeof lessonPhaseSchema>;
export type LessonContent = z.infer<typeof lessonContentSchema>;
