export const TICKET_LIMITS = {
  name: 60,
  description: 500,
  // Money limits in kobo (UI displays naira; converter clamps to these).
  grossPrice: 100_000_000,
  displayPrice: 100_000_000,
  quantity: 100_000,
  maxPerOrder: 100,
} as const
