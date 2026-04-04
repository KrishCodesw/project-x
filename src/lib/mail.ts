// src/lib/mail.ts
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);
const domain = env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  // Fallback for development without API keys
  if (!process.env.RESEND_API_KEY) {
    console.log("=========================================");
    console.log("  MOCK EMAIL SENT TO:", email);
    console.log(" RESET LINK:", resetLink);
    console.log("=========================================");
    return;
  }

  await resend.emails.send({
    from: "onboarding@resend.dev", // Change this to your verified domain later
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};