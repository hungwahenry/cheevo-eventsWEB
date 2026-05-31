export function paystackTransferFee(amountMinor: number): number {
  const naira = amountMinor / 100
  if (naira <= 5_000) return 1_000
  if (naira <= 50_000) return 2_500
  return 5_000
}
