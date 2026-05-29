import type { User } from "@/features/auth/types"
import type { SendOtpInput, VerifyOtpInput } from "@/features/auth/validation"
import { api } from "@/lib/api"

export async function sendOtp(input: SendOtpInput): Promise<void> {
  await api.post<null>("/auth/send-otp", input)
}

// The BFF sets the bearer token in an httpOnly cookie and returns only the user.
export function verifyOtp(input: VerifyOtpInput): Promise<{ user: User }> {
  return api.post<{ user: User }>("/auth/verify-otp", input)
}

export function getMe(): Promise<User> {
  return api.get<User>("/auth/me")
}

export async function logout(): Promise<void> {
  await api.post<null>("/auth/logout")
}
