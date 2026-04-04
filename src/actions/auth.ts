// src/actions/auth.ts
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password, name } = validatedFields.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "Account created! You can now log in." };
}

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Required for NextAuth redirects to work properly
  }
}

// Add this to the bottom of src/actions/auth.ts
export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}