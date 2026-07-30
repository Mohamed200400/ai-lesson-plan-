// lib/validations/lesson.ts
import { z } from "zod";

export const generateLessonSchema = z.object({
  title: z
    .string()
    .min(3, { message: "عنوان الجذاذة يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "العنوان طويل جداً" }),
  
  subject: z
    .string()
    .min(2, { message: "يرجى تحديد المادة" }),
    
  level: z
    .string()
    .min(1, { message: "يرجى تحديد المستوى" }),
    
  time: z
    .coerce
    .number({ message: "مدة الدرس يجب أن تكون رقماً" })
    .min(30, { message: "المدة يجب أن تكون 5 دقائق على الأقل" }),

  pedagogie: z.string().min(1, { message: "يرجى تحديد بيداغوجيا" }),
    

});

// Extract the TypeScript type automatically from the schema
export type GenerateLessonInput = z.infer<typeof generateLessonSchema>;