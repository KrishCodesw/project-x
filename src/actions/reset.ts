// src/actions/reset.ts
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

// Inline schemas for simplicity, or move these to your validations.ts file
const resetSchema = z.object({ email: z.string().email() });
const newPasswordSchema = z.object({ password: z.string().min(8) });

export async function requestPasswordReset(values: z.infer<typeof resetSchema>) {
  const validatedFields = resetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email." };

  const { email } = validatedFields.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    // We still return success to prevent email enumeration attacks
    return { success: "If an account exists, a reset email was sent." };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
}

export async function resetPassword(values: z.infer<typeof newPasswordSchema>, token?: string | null) {
  if (!token) return { error: "Missing token!" };

  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid password." };

  const { password } = validatedFields.data;

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  if (!existingToken) return { error: "Invalid token!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email }
  });

  if (!existingUser) return { error: "Email does not exist!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password and delete the used token
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password updated successfully!" };
}