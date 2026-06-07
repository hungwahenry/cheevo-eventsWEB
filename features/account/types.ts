import type { User } from "@/features/auth"

export type StepUpFactorKind = "otp"

export type StepUpFactor = {
  id: string
  kind: StepUpFactorKind
  target_masked: string
  position: number
  verified: boolean
  sent_at: string | null
}

export type StepUpAction = "change_email" | "delete_account"

export type StepUpChallenge = {
  id: string
  action: StepUpAction
  expires_at: string | null
  completed: boolean
  factors: StepUpFactor[]
  next_factor_id: string | null
  result?: { user?: User } & Record<string, unknown>
}

export type CreateStepUpInput = {
  action: StepUpAction
  payload: Record<string, unknown>
}
