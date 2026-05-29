import type { EventStatus } from "@/features/organizer/events/types"

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
}

const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
}

export type EventWhen = {
  date: string
  time: string | null
}

export function formatEventWhen(
  starts: string | null,
  ends: string | null
): EventWhen {
  if (!starts && !ends) return { date: "—", time: null }

  if (!starts && ends) {
    const e = new Date(ends)
    return {
      date: `Ends ${e.toLocaleDateString(undefined, DATE_FORMAT)}`,
      time: e.toLocaleTimeString(undefined, TIME_FORMAT),
    }
  }

  const s = new Date(starts!)
  const date = s.toLocaleDateString(undefined, DATE_FORMAT)
  const startTime = s.toLocaleTimeString(undefined, TIME_FORMAT)

  if (!ends) return { date, time: startTime }

  const e = new Date(ends)
  const sameDay = s.toDateString() === e.toDateString()

  if (sameDay) {
    return {
      date,
      time: `${startTime} – ${e.toLocaleTimeString(undefined, TIME_FORMAT)}`,
    }
  }

  return {
    date: `${date} → ${e.toLocaleDateString(undefined, DATE_FORMAT)}`,
    time: startTime,
  }
}

export function formatEventTimeWindow(
  starts: string | null,
  ends: string | null
): string | null {
  if (!starts && !ends) return null
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, DATE_TIME_FORMAT)
  if (starts && ends) return `${fmt(starts)} → ${fmt(ends)}`
  if (starts) return `From ${fmt(starts)}`
  return `Until ${fmt(ends!)}`
}

export function formatEventStatus(status: EventStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
