"use server"

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function toggleLike( lessonPlanId: string) {
    const session = await getServerSession(authOptions);
//@ts-ignore
  if (!session?.user?.id) {
    throw new Error("You must be logged in to like a lesson.");
  }
//@ts-ignore
  const userId = session.user.id;

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_lessonPlanId: {
        userId,
        lessonPlanId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { liked: false };
  } else {
    // Like
    await prisma.like.create({
      data: { userId, lessonPlanId },
    });
    return { liked: true };
  }
}