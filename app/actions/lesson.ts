"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { lessonContentSchema, type LessonContent } from "@/lib/lesson-content";
import { generateLessonSchema } from "@/lib/validations/lesson";
import { GoogleGenAI, Type } from "@google/genai";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";

const lessonIdSchema = z.string().min(1, "Invalid lesson ID");

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error("You must be logged in.");
  }

  return userId;
}

const jsonSchema = {
  type: Type.OBJECT,
  properties: {
    competencies: { type: Type.ARRAY, items: { type: Type.STRING } },
    objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
    prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
    didacticMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
    lessonProcess: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phaseName: { type: Type.STRING },
          duration: { type: Type.INTEGER },
          teacherActivity: { type: Type.STRING },
          studentActivity: { type: Type.STRING },
          phaseMaterials: { type: Type.STRING },
          evaluationType: { type: Type.STRING },
          expectedOutputs: { type: Type.STRING },
        },
        required: [
          "phaseName",
          "duration",
          "teacherActivity",
          "studentActivity",
          "phaseMaterials",
          "evaluationType",
          "expectedOutputs",
        ],
      },
    },
    homework: { type: Type.STRING },
  },
  required: [
    "competencies",
    "objectives",
    "prerequisites",
    "didacticMaterials",
    "lessonProcess",
    "homework",
  ],
};

export async function* generateLesson(formData: FormData) {
  // Security boundary: the client never sends userId. The server reads it from
  // the signed session so users cannot create or overwrite data for another account.
  const userId = await requireUserId();
  const input = generateLessonSchema.parse(Object.fromEntries(formData.entries()));

  const prompt = `
    أنت خبير بيداغوجي ومفتش تعليمي محترف. قم بإعداد جذاذة تربوية تفصيلية ومكتملة للدرس التالي:
    - عنوان الدرس: ${input.title}
    - المادة: ${input.subject}
    - المستوى الدراسي: ${input.level}
    - المدة الزمنية الإجمالية: ${input.time} دقيقة
    - المقاربة البيداغوجية المعتمدة: ${input.pedagogie}

    تأكد من أن الأنشطة تطبيقية وعصرية وتراعي المقاربة المذكورة، واجعل التقويم يقيس تحقيق الأهداف بشكل حقيقي.
  `;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const responseStream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
      temperature: 0.7,
    },
  });

  let fullText = "";

  for await (const chunk of responseStream) {
    if (chunk.text) {
      fullText += chunk.text;
      yield chunk.text;
    }
  }

  try {
    const content = lessonContentSchema.parse(JSON.parse(fullText));

    const lesson = await prisma.lessonPlan.create({
      data: {
        title: input.title,
        subject: input.subject,
        level: input.level,
        duration: input.time,
        pedagogicalApproach: input.pedagogie,
        content: content as Prisma.InputJsonValue,
        userId,
      },
    });

    yield `||METADATA||${JSON.stringify({
      success: true,
      message: "تم توليد الجذاذة وحفظها في قاعدة البيانات بنجاح!",
      id: lesson.id,
    })}`;
  } catch (error) {
    console.error("Failed to save generated lesson:", error);
    yield `||METADATA||${JSON.stringify({
      success: false,
      message: "تم توليد النص ولكن فشل الحفظ في قاعدة البيانات.",
      id: null,
    })}`;
  }
}

export async function updateLessonContent(lessonId: string, updatedContent: LessonContent) {
  try {
    const userId = await requireUserId();
    const id = lessonIdSchema.parse(lessonId);
    const content = lessonContentSchema.parse(updatedContent);

    // Authorization rule: a lesson id from the URL is not proof of ownership.
    // Every private write is scoped by both the lesson id and session user id.
    const result = await prisma.lessonPlan.updateMany({
      where: { id, userId },
      data: { content: content as Prisma.InputJsonValue },
    });

    if (result.count === 0) {
      return { success: false, message: "Lesson not found or you do not have permission to edit it." };
    }

    return { success: true, message: "تم حفظ التعديلات بنجاح!" };
  } catch (error) {
    console.error("Failed to update lesson:", error);
    return { success: false, message: "فشل حفظ التعديلات في قاعدة البيانات." };
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const userId = await requireUserId();
    const id = lessonIdSchema.parse(lessonId);

    // Private lesson pages are owner-only. Public community pages must call
    // getPublicLessonById, which adds isPublic: true to the query.
    const lesson = await prisma.lessonPlan.findFirst({
      where: { id, userId },
    });

    if (!lesson) return null;

    return {
      ...lesson,
      content: lessonContentSchema.parse(lesson.content),
    };
  } catch (error) {
    console.error("Failed to fetch private lesson:", error);
    return null;
  }
}

export async function getPublicLessonById(lessonId: string) {
  try {
    const id = lessonIdSchema.parse(lessonId);

    // Public route rule: a shared URL should never reveal private lessons.
    const lesson = await prisma.lessonPlan.findFirst({
      where: { id, isPublic: true },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!lesson) return null;

    return {
      ...lesson,
      content: lessonContentSchema.parse(lesson.content),
    };
  } catch (error) {
    console.error("Failed to fetch public lesson:", error);
    return null;
  }
}

export async function deleteLesson(id: string) {
  try {
    const userId = await requireUserId();
    const lessonId = lessonIdSchema.parse(id);

    const result = await prisma.lessonPlan.deleteMany({
      where: { id: lessonId, userId },
    });

    if (result.count === 0) {
      return { success: false, error: "Lesson not found or you do not have permission to delete it." };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    return {
      success: false,
      error: "تعذر حذف الجذاذة. قد تكون محذوفة مسبقاً أو ليست ملكاً لك.",
    };
  }
}

export async function shareLesson(lessonId: string, isPublic: boolean) {
  try {
    const userId = await requireUserId();
    const id = lessonIdSchema.parse(lessonId);

    const result = await prisma.lessonPlan.updateMany({
      where: { id, userId },
      data: { isPublic },
    });

    if (result.count === 0) {
      return { success: false, message: "Lesson not found or you do not have permission to publish it." };
    }

    return { success: true, message: "تم تحديث حالة المشاركة بنجاح" };
  } catch (error) {
    console.error("Failed to update publish status:", error);
    return { success: false, message: "فشل تحديث حالة المشاركة" };
  }
}

export async function getPublicLesson() {
  try {
    const lessons = await prisma.lessonPlan.findMany({
      where: { isPublic: true },
      include: {
        likes: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "تم تحميل الدروس العمومية بنجاح",
      data: lessons.map((lesson) => ({
        ...lesson,
        content: lessonContentSchema.parse(lesson.content),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch public lessons:", error);
    return { success: false, message: "فشل تحميل الدروس العمومية", data: undefined };
  }
}

export async function incrementDownloads(lessonId: string) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const id = lessonIdSchema.parse(lessonId);

    // Downloads are allowed for public lessons, and for the owner on private pages.
    const result = await prisma.lessonPlan.updateMany({
      where: {
        id,
        OR: [{ isPublic: true }, ...(userId ? [{ userId }] : [])],
      },
      data: {
        downloadsCount: {
          increment: 1,
        },
      },
    });

    if (result.count === 0) {
      return { success: false, error: "Lesson not found or not downloadable." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to increment downloads count:", error);
    return { success: false, error: "Database update failed" };
  }
}
