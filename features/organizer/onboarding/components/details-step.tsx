"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/features/organizer/onboarding/components/field"
import type { OrganizerOnboarding } from "@/features/organizer/onboarding/hooks"

export function DetailsStep({ wizard }: { wizard: OrganizerOnboarding }) {
  const { draft, patch, errors } = wizard

  return (
    <div className="flex flex-col gap-5">
      <Field
        label="About"
        htmlFor="about"
        hint="A short description of what you do."
      >
        <Textarea
          id="about"
          value={draft.about}
          onChange={(event) => patch({ about: event.target.value })}
          rows={4}
          placeholder="Tell attendees what your events are about…"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Contact email"
          htmlFor="contactEmail"
          error={errors.contactEmail}
        >
          <Input
            id="contactEmail"
            type="email"
            value={draft.contactEmail}
            onChange={(event) => patch({ contactEmail: event.target.value })}
            placeholder="hello@org.com"
            autoCapitalize="none"
          />
        </Field>

        <Field label="Contact phone" htmlFor="contactPhone">
          <Input
            id="contactPhone"
            value={draft.contactPhone}
            onChange={(event) => patch({ contactPhone: event.target.value })}
            placeholder="+234…"
          />
        </Field>

        <Field label="Website" htmlFor="website" error={errors.website}>
          <Input
            id="website"
            value={draft.website}
            onChange={(event) => patch({ website: event.target.value })}
            placeholder="https://…"
            autoCapitalize="none"
          />
        </Field>

        <Field label="City" htmlFor="city">
          <Input
            id="city"
            value={draft.city}
            onChange={(event) => patch({ city: event.target.value })}
            placeholder="Lagos"
          />
        </Field>
      </div>
    </div>
  )
}
