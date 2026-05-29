"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "@/features/organizer/onboarding/components/field"
import { SlugField } from "@/features/organizer/onboarding/components/slug-field"
import type { OrganizerOnboarding } from "@/features/organizer/onboarding/hooks"

export function BasicsStep({ wizard }: { wizard: OrganizerOnboarding }) {
  const { draft, patch, errors, categories, slugStatus } = wizard

  return (
    <div className="flex flex-col gap-5">
      <Field label="Organisation name" htmlFor="name">
        <Input
          id="name"
          value={draft.name}
          onChange={(event) => patch({ name: event.target.value })}
          placeholder="e.g. Lagos Nightlife"
          autoFocus
        />
      </Field>

      <Field label="Handle" htmlFor="slug" error={errors.slug}>
        <SlugField
          value={draft.slug}
          onChange={(value) => patch({ slug: value })}
          status={slugStatus}
        />
      </Field>

      <Field label="Category">
        <Select
          value={draft.categoryId ? String(draft.categoryId) : undefined}
          onValueChange={(value) => patch({ categoryId: Number(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}
