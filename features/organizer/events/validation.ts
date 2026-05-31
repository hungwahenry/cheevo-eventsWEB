import {
  EVENT_FEATURE_LIMITS,
  EVENT_LIMITS,
} from "@/features/organizer/events/limits"
import { z } from "zod"

const urlOrEmpty = (max: number) =>
  z
    .string()
    .max(max)
    .refine(
      (value) => value === "" || /^https?:\/\/\S+$/.test(value),
      "Enter a valid URL."
    )

export const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(
        EVENT_LIMITS.title,
        `Keep it under ${EVENT_LIMITS.title} characters.`
      ),
    description: z.string().max(EVENT_LIMITS.description),
    starts_at: z.string(),
    ends_at: z.string(),
    venue_name: z.string().max(EVENT_LIMITS.venueName),
    address: z.string().max(EVENT_LIMITS.address),
    city: z.string().max(EVENT_LIMITS.city),
    place_id: z.string().max(255),
    latitude: z.string(),
    longitude: z.string(),
    video_url: urlOrEmpty(EVENT_LIMITS.videoUrl),
    presale_until: z.string(),
    interests: z.array(z.string()),
  })
  .refine(
    (data) =>
      !data.starts_at || !data.ends_at || data.ends_at >= data.starts_at,
    { path: ["ends_at"], message: "End must be on or after start." }
  )

export type EventInput = z.infer<typeof eventSchema>

export const eventFeatureSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(
        EVENT_FEATURE_LIMITS.title,
        `Keep it under ${EVENT_FEATURE_LIMITS.title} characters.`
      ),
    description: z.string().max(EVENT_FEATURE_LIMITS.description),
    link: urlOrEmpty(EVENT_FEATURE_LIMITS.link),
    starts_at: z.string(),
    ends_at: z.string(),
  })
  .refine(
    (data) =>
      !data.starts_at || !data.ends_at || data.ends_at >= data.starts_at,
    { path: ["ends_at"], message: "End must be on or after start." }
  )

export type EventFeatureInput = z.infer<typeof eventFeatureSchema>
