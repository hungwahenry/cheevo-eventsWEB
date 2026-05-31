import * as payoutsApi from "@/features/organizer/payouts/api"
import {
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
