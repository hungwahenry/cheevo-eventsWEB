import { CheckIcon } from "lucide-react"

import { loadPricing } from "@/features/marketing/api"
import { formatMoney } from "@/lib/format/money"

const CURRENCY = "NGN"

function formatBps(bps: number): string {
  const pct = bps / 100
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(2)}%`
}

export async function PricingSection() {
  const pricing = await loadPricing()

  const sampleTicketNaira = 5_000
  const sampleTicketMinor = sampleTicketNaira * 100
  const sampleFeeMinor =
    pricing.flatMinor +
    Math.round((sampleTicketMinor * pricing.percentageBps) / 10_000)
  const sampleTotalMinor = sampleTicketMinor + sampleFeeMinor
  const tier1Ceiling = pricing.tier1NairaCeiling * 100
  const tier2Ceiling = pricing.tier2NairaCeiling * 100

  return (
    <section className="bg-foreground/[0.02] px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            Pricing
          </p>
          <h2 className="max-w-2xl text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            Free to start. You only pay when you sell.
          </h2>
          <p className="max-w-xl text-base text-foreground/65">
            No subscription. No setup fees. No monthly bill. Cheevo&rsquo;s
            service fee is added at checkout — your buyers see it, you
            don&rsquo;t pay it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <PricingCard
            label="Service fee"
            sub="Paid by the buyer at checkout."
            featured
          >
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight tabular-nums">
                {formatMoney(pricing.flatMinor, CURRENCY)}
              </span>
              <span className="text-base font-semibold text-foreground/55">
                +&nbsp;{formatBps(pricing.percentageBps)}
              </span>
            </div>
            <p className="text-sm text-foreground/65">
              Flat fee plus a small percentage of the ticket price.
            </p>
            <ul className="mt-2 flex flex-col gap-2 border-t border-foreground/10 pt-4 text-sm text-foreground/75">
              <Bullet>You keep 100% of your ticket price</Bullet>
              <Bullet>Free events are 100% free to host</Bullet>
              <Bullet>
                Example: a {formatMoney(sampleTicketMinor, CURRENCY)} ticket
                → buyer pays {formatMoney(sampleTotalMinor, CURRENCY)}
              </Bullet>
            </ul>
          </PricingCard>

          <PricingCard
            label="Settlement"
            sub="From sale to your bank account."
          >
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight tabular-nums">
                T+{pricing.holdWindowDays}
              </span>
              <span className="text-base font-semibold text-foreground/55">
                days
              </span>
            </div>
            <p className="text-sm text-foreground/65">
              Each paid order clears to your available balance{" "}
              {pricing.holdWindowDays} days after the sale.
            </p>
            <ul className="mt-2 flex flex-col gap-2 border-t border-foreground/10 pt-4 text-sm text-foreground/75">
              <Bullet>Daily payouts to your Nigerian bank</Bullet>
              <Bullet>No 30-day hold</Bullet>
              <Bullet>Live balance, always visible</Bullet>
            </ul>
          </PricingCard>

          <PricingCard
            label="Transfer fee"
            sub="What Paystack charges to move money."
          >
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight tabular-nums">
                {formatMoney(pricing.tier1Minor, CURRENCY)}
              </span>
              <span className="text-base font-semibold text-foreground/55">
                &ndash;&nbsp;{formatMoney(pricing.tier3Minor, CURRENCY)}
              </span>
            </div>
            <p className="text-sm text-foreground/65">
              Per payout. Cheevo doesn&rsquo;t mark this up — it&rsquo;s
              passed through at cost.
            </p>
            <ul className="mt-2 flex flex-col gap-2 border-t border-foreground/10 pt-4 text-sm text-foreground/75">
              <Bullet>
                Up to {formatMoney(tier1Ceiling, CURRENCY)}:{" "}
                {formatMoney(pricing.tier1Minor, CURRENCY)}
              </Bullet>
              <Bullet>
                Up to {formatMoney(tier2Ceiling, CURRENCY)}:{" "}
                {formatMoney(pricing.tier2Minor, CURRENCY)}
              </Bullet>
              <Bullet>
                Above {formatMoney(tier2Ceiling, CURRENCY)}:{" "}
                {formatMoney(pricing.tier3Minor, CURRENCY)}
              </Bullet>
            </ul>
          </PricingCard>
        </div>

        <p className="text-xs text-foreground/45">
          Worked example: a {formatMoney(sampleTicketMinor, CURRENCY)} ticket
          → buyer pays {formatMoney(sampleTotalMinor, CURRENCY)} (
          {formatMoney(sampleFeeMinor, CURRENCY)} service fee). You receive
          the full {formatMoney(sampleTicketMinor, CURRENCY)}, then pay{" "}
          {formatMoney(pricing.tier1Minor, CURRENCY)}–
          {formatMoney(pricing.tier3Minor, CURRENCY)} to cash out depending
          on amount.
        </p>
      </div>
    </section>
  )
}

function PricingCard({
  label,
  sub,
  children,
  featured,
}: {
  label: string
  sub: string
  children: React.ReactNode
  featured?: boolean
}) {
  return (
    <div
      className={
        "flex flex-col gap-4 rounded-2xl border p-6 md:p-7 " +
        (featured
          ? "border-primary/30 bg-card shadow-[0_25px_60px_-25px_rgba(218,114,46,0.35)] lg:-translate-y-2"
          : "border-foreground/10 bg-card")
      }
    >
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          {label}
        </p>
        <p className="text-xs text-foreground/55">{sub}</p>
      </div>
      {children}
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <CheckIcon className="size-2.5" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  )
}
