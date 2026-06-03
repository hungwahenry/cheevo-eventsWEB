import type {
  AdminInterest,
  UpsertInterestPayload,
} from "@/features/admin/interests/types"
import { api } from "@/lib/api"

export function listInterests(): Promise<AdminInterest[]> {
  return api.get<AdminInterest[]>("/admin/interests")
}

export function createInterest(
  payload: UpsertInterestPayload
): Promise<AdminInterest> {
  return api.post<AdminInterest>("/admin/interests", payload)
}

export function updateInterest(
  id: number,
  payload: UpsertInterestPayload
): Promise<AdminInterest> {
  return api.patch<AdminInterest>(`/admin/interests/${id}`, payload)
}

export function deleteInterest(id: number): Promise<void> {
  return api.delete<void>(`/admin/interests/${id}`)
}
