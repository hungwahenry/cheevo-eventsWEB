import * as orgApi from "@/features/organizer/onboarding/api"
import { SLUG_PATTERN } from "@/features/organizer/onboarding/validation"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export function useCategories() {
  return useQuery({
    queryKey: ["organizer", "categories"],
    queryFn: orgApi.getCategories,
    staleTime: 10 * 60_000,
  })
}

export function useSocialPlatforms() {
  return useQuery({
    queryKey: ["organizer", "social-platforms"],
    queryFn: orgApi.getSocialPlatforms,
    staleTime: 10 * 60_000,
  })
}

/** Debounced live availability for the organisation handle (slug). */
export function useSlugAvailability(slug: string) {
  const [debounced, setDebounced] = useState("")

  useEffect(() => {
    const handle = setTimeout(
      () => setDebounced(slug.trim().toLowerCase()),
      400
    )
    return () => clearTimeout(handle)
  }, [slug])

  const isValidFormat =
    debounced.length >= 3 &&
    debounced.length <= 50 &&
    SLUG_PATTERN.test(debounced)

  const query = useQuery({
    queryKey: ["organizer", "slug-available", debounced],
    queryFn: () => orgApi.checkSlug(debounced),
    enabled: isValidFormat,
    staleTime: 60_000,
  })

  return {
    isValidFormat,
    isChecking: isValidFormat && query.isFetching,
    available: isValidFormat ? query.data?.available : undefined,
  }
}
