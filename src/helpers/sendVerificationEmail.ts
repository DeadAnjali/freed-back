import { resend } from "@/lib/resend";

import VerificaionEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Freed-Back Message | Verification Code',
      react: VerificaionEmail({ username, otp: verifyCode }),
    });

    return {
      success: false,
      message: "Verification email sent",
    };
  }catch (error) {
    console.log("Failed to send verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}