import type {
  CreateStepUpInput,
  StepUpChallenge,
} from "@/features/account/types"
import { api } from "@/lib/api"

export function createChallenge(
  input: CreateStepUpInput
): Promise<StepUpChallenge> {
  return api.post<StepUpChallenge>("/attendee/step-up", input)
}

export function verifyFactor(
  challengeId: string,
  factorId: string,
  code: string
): Promise<StepUpChallenge> {
  return api.post<StepUpChallenge>(`/attendee/step-up/${challengeId}/verify`, {
    factor_id: factorId,
    code,
  })
}

export function resendFactor(
  challengeId: string,
  factorId: string
): Promise<null> {
  return api.post<null>(`/attendee/step-up/${challengeId}/resend`, {
    factor_id: factorId,
  })
}

export function getDataExport(): Promise<unknown> {
  return api.get<unknown>("/attendee/data-export")
}
