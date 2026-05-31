import type {
  Balance,
  Bank,
  PayoutAccount,
  ResolvedAccount,
} from "@/features/organizer/payouts/types"
import { api } from "@/lib/api"

export function listBanks(): Promise<Bank[]> {
  return api.get<Bank[]>("/organizer/payouts/banks")
}

export function resolveBankAccount(
  bankCode: string,
  accountNumber: string
): Promise<ResolvedAccount> {
  return api.post<ResolvedAccount>("/organizer/payouts/resolve", {
    bank_code: bankCode,
    account_number: accountNumber,
  })
}

export function getPayoutAccount(orgId: string): Promise<PayoutAccount | null> {
  return api.get<PayoutAccount | null>(
    `/organizer/organisations/${orgId}/payout-account`
  )
}

export function savePayoutAccount(
  orgId: string,
  payload: { bank_code: string; account_number: string }
): Promise<PayoutAccount> {
  return api.put<PayoutAccount>(
    `/organizer/organisations/${orgId}/payout-account`,
    payload
  )
}

export function deletePayoutAccount(orgId: string): Promise<null> {
  return api.delete<null>(
    `/organizer/organisations/${orgId}/payout-account`
  )
}

export function getBalance(orgId: string): Promise<Balance> {
  return api.get<Balance>(`/organizer/organisations/${orgId}/balance`)
}
