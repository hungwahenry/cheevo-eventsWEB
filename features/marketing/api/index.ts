import "server-only"

import type { Pricing } from "@/features/marketing/types"
import { serverConfig } from "@/lib/server/config"

const REVALIDATE_SECONDS = 300

type ApiSuccess<T> = { status: "success"; message: string; data: T }
type PublicConfig = Record<string, unknown>

const DEFAULT_PRICING: Pricing = {
  flatMinor: 10000,
  percentageBps: 300,
  holdWindowDays: 2,
  tier1NairaCeiling: 5000,
  tier2NairaCeiling: 50000,
  tier1Minor: 1000,
  tier2Minor: 2500,
  tier3Minor: 5000,
}

function asInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value)
  return fallback
}

export async function loadPricing(): Promise<Pricing> {
  try {
    const response = await fetch(`${serverConfig.apiBaseUrl}/config`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["public-config"] },
    })

    if (!response.ok) return DEFAULT_PRICING

    const envelope = (await response.json()) as ApiSuccess<PublicConfig>
    const config = envelope.data ?? {}

    return {
      flatMinor: asInt(config["orders.fee_flat_minor"], DEFAULT_PRICING.flatMinor),
      percentageBps: asInt(config["orders.fee_percentage_bps"], DEFAULT_PRICING.percentageBps),
      holdWindowDays: asInt(config["payouts.hold_window_days"], DEFAULT_PRICING.holdWindowDays),
      tier1NairaCeiling: asInt(config["payouts.transfer_fee_tier_1_naira"], DEFAULT_PRICING.tier1NairaCeiling),
      tier2NairaCeiling: asInt(config["payouts.transfer_fee_tier_2_naira"], DEFAULT_PRICING.tier2NairaCeiling),
      tier1Minor: asInt(config["payouts.transfer_fee_tier_1_minor"], DEFAULT_PRICING.tier1Minor),
      tier2Minor: asInt(config["payouts.transfer_fee_tier_2_minor"], DEFAULT_PRICING.tier2Minor),
      tier3Minor: asInt(config["payouts.transfer_fee_tier_3_minor"], DEFAULT_PRICING.tier3Minor),
    }
  } catch {
    return DEFAULT_PRICING
  }
}
