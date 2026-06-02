"use client"

import { Button } from "@/components/ui/button"
import type { Organisation } from "@/features/auth"
import { BrandingSection } from "@/features/organizer/settings/components/branding-section"
import { ContactSection } from "@/features/organizer/settings/components/contact-section"
import { NotificationsSection } from "@/features/organizer/settings/components/notifications-section"
import { ProfileSection } from "@/features/organizer/settings/components/profile-section"
import {
  SocialsSection,
  type DraftSocials,
} from "@/features/organizer/settings/components/socials-section"
import {
  useSocialPlatforms,
  useUpdateOrganisation,
} from "@/features/organizer/settings/hooks"
import { useState } from "react"

type Props = { organisation: Organisation }

export function SettingsForm({ organisation }: Props) {
  const socialPlatforms = useSocialPlatforms()
  const save = useUpdateOrganisation(organisation.id)

  const [name, setName] = useState(organisation.name)
  const [slug, setSlug] = useState(organisation.slug)
  const [categoryId, setCategoryId] = useState<number | null>(
    organisation.category?.id ?? null
  )
  const [city, setCity] = useState(organisation.city ?? "")
  const [about, setAbout] = useState(organisation.about ?? "")
  const [contactEmail, setContactEmail] = useState(
    organisation.contact_email ?? ""
  )
  const [contactPhone, setContactPhone] = useState(
    organisation.contact_phone ?? ""
  )
  const [website, setWebsite] = useState(organisation.website ?? "")
  const [socials, setSocials] = useState<DraftSocials>(() =>
    Object.fromEntries(organisation.socials.map((s) => [s.platform, s.handle]))
  )
  const [logo, setLogo] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate({
      name: name.trim(),
      slug: slug.trim(),
      category_id: categoryId ?? undefined,
      about: about.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      website: website.trim(),
      city: city.trim(),
      logo,
      cover,
      socials: Object.entries(socials)
        .filter(([, handle]) => handle.trim() !== "")
        .map(([slug, handle]) => {
          const platform = (socialPlatforms.data ?? []).find((p) => p.slug === slug)
          return platform
            ? { platform_id: platform.id, handle: handle.trim() }
            : null
        })
        .filter((s): s is { platform_id: number; handle: string } => s !== null),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <BrandingSection
            logo={logo}
            cover={cover}
            existingLogoUrl={organisation.logo_url}
            existingCoverUrl={organisation.cover_url}
            onLogoChange={setLogo}
            onCoverChange={setCover}
          />

          <ProfileSection
            name={name}
            slug={slug}
            categoryId={categoryId}
            city={city}
            about={about}
            onNameChange={setName}
            onSlugChange={setSlug}
            onCategoryChange={setCategoryId}
            onCityChange={setCity}
            onAboutChange={setAbout}
          />

          <ContactSection
            email={contactEmail}
            phone={contactPhone}
            website={website}
            onEmailChange={setContactEmail}
            onPhoneChange={setContactPhone}
            onWebsiteChange={setWebsite}
          />

          <NotificationsSection />
        </div>

        <aside className="flex flex-col gap-6">
          <SocialsSection socials={socials} onChange={setSocials} />
        </aside>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
