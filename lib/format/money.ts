const NAIRA = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
})

export function formatNaira(kobo: number): string {
  return NAIRA.format(kobo / 100)
}

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
