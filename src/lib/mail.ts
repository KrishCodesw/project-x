// src/lib/mail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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