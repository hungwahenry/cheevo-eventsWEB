import { z } from "zod"

export const sendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
})

export type SendOtpInput = z.infer<typeof sendOtpSchema>

export const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  code: z
    .string()
    .trim()
    .length(6, "Enter the 6-digit code.")
    .regex(/^\d+$/, "The code must be 6 digits."),
})

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
