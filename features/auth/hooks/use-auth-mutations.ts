import * as authApi from "@/features/auth/api"
import { useMutation } from "@tanstack/react-query"

export function useSendOtp() {
  return useMutation({ mutationFn: authApi.sendOtp })
}

export function useVerifyOtp() {
  return useMutation({ mutationFn: authApi.verifyOtp })
}

export function useLogout() {
  return useMutation({ mutationFn: authApi.logout })
}
