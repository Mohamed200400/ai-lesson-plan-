'use server'

import  prisma  from "@/lib/db";
import bcrypt from "bcrypt";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Basic Validation
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    // 3. Hash the password
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save to database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Server Action Registration Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}