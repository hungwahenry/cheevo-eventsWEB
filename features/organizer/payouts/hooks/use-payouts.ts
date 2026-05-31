import * as payoutsApi from "@/features/organizer/payouts/api"
import { isApiError } from "@/lib/api"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

export const banksKey = ["organizer-payout-banks"] as const
export const payoutAccountKey = (orgId: string) =>
  ["organizer-payout-account", orgId] as const
export const balanceKey = (orgId: string) =>
  ["organizer-payout-balance", orgId] as const
export const payoutsListKey = (orgId: string, page: number) =>
  ["organizer-payouts", orgId, page] as const
export const payoutKey = (orgId: string, payoutId: string) =>
  ["organizer-payout", orgId, payoutId] as const

export function useBanks() {
  return useQuery({
    queryKey: banksKey,
    queryFn: payoutsApi.listBanks,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useResolveBankAccount() {
  return useMutation({
    mutationFn: (vars: { bankCode: string; accountNumber: string }) =>
      payoutsApi.resolveBankAccount(vars.bankCode, vars.accountNumber),
  })
}

export function usePayoutAccount(orgId: string) {
  return useQuery({
    queryKey: payoutAccountKey(orgId),
    queryFn: () => payoutsApi.getPayoutAccount(orgId),
  })
}

export function useSavePayoutAccount(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { bankCode: string; accountNumber: string }) =>
      payoutsApi.savePayoutAccount(orgId, {
        bank_code: vars.bankCode,
        account_number: vars.accountNumber,
      }),
    onSuccess: () => {
      toast.success("Payout account saved.")
      queryClient.invalidateQueries({ queryKey: payoutAccountKey(orgId) })
    },
  })
}

export function useDeletePayoutAccount(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => payoutsApi.deletePayoutAccount(orgId),
    onSuccess: () => {
      toast.success("Payout account removed.")
      queryClient.invalidateQueries({ queryKey: payoutAccountKey(orgId) })
    },
  })
}

export function useBalance(orgId: string) {
  return useQuery({
    queryKey: balanceKey(orgId),
    queryFn: () => payoutsApi.getBalance(orgId),
  })
}

export function usePayouts(orgId: string, page: number) {
  return useQuery({
    queryKey: payoutsListKey(orgId, page),
    queryFn: () => payoutsApi.listPayouts(orgId, page),
    placeholderData: keepPreviousData,
  })
}

export function usePayout(orgId: string, payoutId: string) {
  return useQuery({
    queryKey: payoutKey(orgId, payoutId),
    queryFn: () => payoutsApi.getPayout(orgId, payoutId),
  })
}

export function useRequestPayout(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (amountMinor: number) =>
      payoutsApi.requestPayout(orgId, amountMinor),
    onSuccess: () => {
      toast.success("Payout requested. We’ll review it shortly.")
      queryClient.invalidateQueries({
        queryKey: ["organizer-payouts", orgId],
      })
      queryClient.invalidateQueries({ queryKey: balanceKey(orgId) })
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Could not request payout.")
      }
    },
  })
}
