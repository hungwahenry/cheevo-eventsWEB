import * as authApi from "@/features/auth/api"
import { useQuery } from "@tanstack/react-query"

export const meQueryKey = ["me"] as const

/** The current session: resolves the authenticated user via the BFF (cookie-backed). */
export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: authApi.getMe,
    staleTime: 60_000,
    retry: false,
  })
}
