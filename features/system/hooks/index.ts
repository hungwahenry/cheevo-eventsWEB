import * as api from "@/features/system/api"
import type {
  ConfigKey,
  ConfigResponse,
  FeatureFlagKey,
  FlagsResponse,
} from "@/features/system/types"
import { useQuery } from "@tanstack/react-query"

export const flagsKey = () => ["system", "flags"] as const
export const configKey = () => ["system", "config"] as const

export function useFlags() {
  return useQuery({
    queryKey: flagsKey(),
    queryFn: () => api.fetchFlags(),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  })
}

export function useConfig() {
  return useQuery({
    queryKey: configKey(),
    queryFn: () => api.fetchConfig(),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  })
}

/**
 * Check a feature flag. Returns false while loading or for unknown keys (fail-safe-off).
 */
export function useFeature(key: FeatureFlagKey): boolean {
  const { data } = useFlags()
  return Boolean(data?.[key])
}

/**
 * Read a typed config value. Returns the fallback while loading or for unknown keys.
 */
export function useConfigValue<T>(key: ConfigKey, fallback: T): T {
  const { data } = useConfig()
  const value = data?.[key]
  return value !== undefined ? (value as T) : fallback
}

export type { ConfigKey, ConfigResponse, FeatureFlagKey, FlagsResponse }
