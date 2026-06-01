"use client"

import { BrandingUploader } from "@/features/organizer/settings/components/branding-uploader"

type Props = {
  logo: File | null
  cover: File | null
  existingLogoUrl: string | null
  existingCoverUrl: string | null
  onLogoChange: (file: File | null) => void
  onCoverChange: (file: File | null) => void
}

export function BrandingSection({
  logo,
  cover,
  existingLogoUrl,
  existingCoverUrl,
  onLogoChange,
  onCoverChange,
}: Props) {
  return (
    <section className="bg-card rounded-xl p-5">
      <h2 className="mb-1 text-sm font-semibold">Branding</h2>
      <p className="text-muted-foreground mb-4 text-xs">
        Logo and cover are shown across attendees&apos; feeds and your event
        pages.
      </p>
      <BrandingUploader
        logo={logo}
        cover={cover}
        existingLogoUrl={existingLogoUrl}
        existingCoverUrl={existingCoverUrl}
        onSelectLogo={onLogoChange}
        onSelectCover={onCoverChange}
      />
    </section>
  )
}
