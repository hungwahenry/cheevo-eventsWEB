"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import type { Organisation } from "@/features/auth"
import { SocialHandleField } from "@/features/organizer/onboarding/components/social-handle-field"
import { BrandingUploader } from "@/features/organizer/settings/components/branding-uploader"
import {
  useCategories,
  useSocialPlatforms,
  useUpdateOrganisation,
} from "@/features/organizer/settings/hooks"
import { useState } from "react"

type Props = { organisation: Organisation }

type DraftSocials = Record<number, string>

export function SettingsForm({ organisation }: Props) {
  const categories = useCategories()
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
    Object.fromEntries(
      organisation.socials.map((s) => {
        const platform = (socialPlatforms.data ?? []).find(
          (p) => p.slug === s.platform
        )
        return [platform?.id ?? 0, s.handle]
      })
    )
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
        .map(([platform_id, handle]) => ({
          platform_id: Number(platform_id),
          handle: handle.trim(),
        })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-8">
      <section className="bg-card rounded-xl p-5">
        <h2 className="mb-1 text-sm font-semibold">Branding</h2>
        <p className="text-muted-foreground mb-4 text-xs">
          Logo and cover are shown across attendees&apos; feeds and your event
          pages.
        </p>
        <BrandingUploader
          logo={logo}
          cover={cover}
          existingLogoUrl={organisation.logo_url}
          existingCoverUrl={organisation.cover_url}
          onSelectLogo={setLogo}
          onSelectCover={setCover}
        />
      </section>

      <section className="bg-card rounded-xl p-5">
        <h2 className="mb-4 text-sm font-semibold">Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Handle</Label>
            <Input
              id="slug"
              value={slug}
              maxLength={50}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            {categories.isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={categoryId !== null ? String(categoryId) : ""}
                onValueChange={(v) => setCategoryId(Number(v))}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories.data ?? []).map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              maxLength={60}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lagos"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={about}
              maxLength={600}
              rows={4}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="What kind of events do you run?"
            />
            <p className="text-muted-foreground text-right text-xs">
              {about.length}/600
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl p-5">
        <h2 className="mb-4 text-sm font-semibold">Contact</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={contactEmail}
              maxLength={255}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@yourbrand.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              type="tel"
              value={contactPhone}
              maxLength={30}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+234 800 000 0000"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              maxLength={255}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourbrand.com"
            />
          </div>
        </div>
      </section>

      <section className="bg-card rounded-xl p-5">
        <h2 className="mb-4 text-sm font-semibold">Socials</h2>
        {socialPlatforms.isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {(socialPlatforms.data ?? []).map((platform) => (
              <div key={platform.id} className="flex flex-col gap-2">
                <Label>{platform.name}</Label>
                <SocialHandleField
                  platform={platform}
                  value={socials[platform.id] ?? ""}
                  onChange={(value) =>
                    setSocials((prev) => ({ ...prev, [platform.id]: value }))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
