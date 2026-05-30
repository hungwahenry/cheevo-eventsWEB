"use client"

import { useInterests } from "@/features/organizer/events/hooks"
import type { EventInput } from "@/features/organizer/events/validation"
import { cn } from "@/lib/utils"
import type { UseFormReturn } from "react-hook-form"

export function InterestsSection({
  form,
}: {
  form: UseFormReturn<EventInput>
}) {
  const { data: interests, isLoading } = useInterests()
  const selected = form.watch("interests")

  const toggle = (slug: string) => {
    const next = selected.includes(slug)
      ? selected.filter((s) => s !== slug)
      : [...selected, slug]
    form.setValue("interests", next, { shouldDirty: true })
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Interests</h2>
        <p className="text-xs text-muted-foreground">
          Tag this event so the right attendees discover it in their feed.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading interests…</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {interests?.map((interest) => {
            const isActive = selected.includes(interest.slug)
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggle(interest.slug)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-muted/40"
                )}
              >
                {interest.name}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
