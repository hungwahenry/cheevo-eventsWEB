"use client"

import { BrandingHeader } from "@/features/organizer/onboarding/components/branding-header"
import type { OrganizerOnboarding } from "@/features/organizer/onboarding/hooks"

export function BrandingStep({ wizard }: { wizard: OrganizerOnboarding }) {
  const { draft, patch } = wizard

  return (
    <div className="flex flex-col gap-3">
      <BrandingHeader
        logo={draft.logo}
        cover={draft.cover}
        onSelectLogo={(file) => patch({ logo: file })}
        onSelectCover={(file) => patch({ cover: file })}
      />
      <p className="text-sm text-muted-foreground">
        Add a logo and cover photo. Both optional — you can set these up later.
      </p>
    </div>
  )
}
