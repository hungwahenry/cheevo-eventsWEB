import type {
  Balance,
  Bank,
  Payout,
  PayoutAccount,
  PayoutsPage,
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

export function listPayouts(orgId: string, page: number): Promise<PayoutsPage> {
  return api.get<PayoutsPage>(`/organizer/organisations/${orgId}/payouts`, {
    params: { page, per_page: 20 },
  })
}

export function getPayout(orgId: string, payoutId: string): Promise<Payout> {
  return api.get<Payout>(
    `/organizer/organisations/${orgId}/payouts/${payoutId}`
  )
}

export function requestPayout(
  orgId: string,
  amountMinor: number
): Promise<Payout> {
  return api.post<Payout>(`/organizer/organisations/${orgId}/payouts`, {
    amount_minor: amountMinor,
  })
}
