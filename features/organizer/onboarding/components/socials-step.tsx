"use client"

import { Field } from "@/features/organizer/onboarding/components/field"
import { SocialHandleField } from "@/features/organizer/onboarding/components/social-handle-field"
import type { OrganizerOnboarding } from "@/features/organizer/onboarding/hooks"

export function SocialsStep({ wizard }: { wizard: OrganizerOnboarding }) {
  const { socialPlatforms, draft, setSocialHandle } = wizard

  return (
    <div className="flex flex-col gap-5">
      {socialPlatforms.map((platform) => (
        <Field key={platform.id} label={platform.name}>
          <SocialHandleField
            platform={platform}
            value={draft.socials[platform.id] ?? ""}
            onChange={(value) => setSocialHandle(platform.id, value)}
          />
        </Field>
      ))}
    </div>
  )
}
