// Display knowledge per currency lives here so callers only need (amount, currency).
// Adding a new currency = one entry below.
const CURRENCY: Record<string, { locale: string; minorUnits: number }> = {
  NGN: { locale: "en-NG", minorUnits: 100 },
  USD: { locale: "en-US", minorUnits: 100 },
  GHS: { locale: "en-GH", minorUnits: 100 },
  KES: { locale: "en-KE", minorUnits: 100 },
  ZAR: { locale: "en-ZA", minorUnits: 100 },
}

const DEFAULT_CURRENCY = "NGN"

function spec(currency: string) {
  return CURRENCY[currency] ?? CURRENCY[DEFAULT_CURRENCY]
}

export function formatMoney(minor: number, currency: string): string {
  const { locale, minorUnits } = spec(currency)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / minorUnits)
}

// Organizer form helpers — NGN-only today; when we add a currency picker
// these gain a `currency` parameter and route through `spec()`.
export function koboToNairaInput(kobo: number | null | undefined): string {
  if (kobo === null || kobo === undefined) return ""
  return String(kobo / 100)
}

export function nairaInputToKobo(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === "") return null
  const naira = Number(trimmed)
  if (!Number.isFinite(naira) || naira < 0) return null
  return Math.round(naira * 100)
}
