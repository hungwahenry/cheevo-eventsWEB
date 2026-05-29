import { getPlaceDetails, searchPlaces } from "@/features/organizer/events/api"
import type {
  PlaceDetails,
  PlacePrediction,
} from "@/features/organizer/events/types"
import { useEffect, useRef, useState } from "react"

function newToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/**
 * Debounced Places autocomplete with managed session tokens so Google bills
 * the whole search + the final details lookup as one (cheaper) session.
 * The token is generated lazily on first search and reset after a details
 * resolve, so the next search starts a fresh session.
 */
export function usePlaceSearch() {
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setPredictions([])
      setIsSearching(false)
      return
    }

    if (!tokenRef.current) tokenRef.current = newToken()
    const token = tokenRef.current
    setIsSearching(true)
    let cancelled = false

    const handle = setTimeout(async () => {
      try {
        const results = await searchPlaces(trimmed, token)
        if (!cancelled) setPredictions(results)
      } catch {
        if (!cancelled) setPredictions([])
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [query])

  const resolve = async (placeId: string): Promise<PlaceDetails | null> => {
    if (!tokenRef.current) tokenRef.current = newToken()
    const token = tokenRef.current
    try {
      return await getPlaceDetails(placeId, token)
    } catch {
      return null
    } finally {
      // End the billing session; the next search starts a new token.
      tokenRef.current = null
      setQuery("")
      setPredictions([])
    }
  }

  return { query, setQuery, predictions, isSearching, resolve }
}
