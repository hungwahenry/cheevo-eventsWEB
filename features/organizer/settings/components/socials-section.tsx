"use client"

import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { SocialHandleField } from "@/features/organizer/onboarding/components/social-handle-field"
import { useSocialPlatforms } from "@/features/organizer/settings/hooks"

export type DraftSocials = Record<number, string>

type Props = {
  socials: DraftSocials
  onChange: (next: DraftSocials) => void
}

export function SocialsSection({ socials, onChange }: Props) {
  const socialPlatforms = useSocialPlatforms()

  return (
    <section className="bg-card rounded-xl p-5 lg:sticky lg:top-6">
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
                  onChange({ ...socials, [platform.id]: value })
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
