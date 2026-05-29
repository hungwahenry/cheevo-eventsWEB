"use client"

import { Input } from "@/components/ui/input"
import { Field } from "@/features/organizer/onboarding/components/field"
import type { OrganizerOnboarding } from "@/features/organizer/onboarding/hooks"

export function SocialsStep({ wizard }: { wizard: OrganizerOnboarding }) {
  const { socialPlatforms, draft, setSocialHandle } = wizard

  return (
    <div className="flex flex-col gap-5">
      {socialPlatforms.map((platform) => (
        <Field key={platform.id} label={platform.name}>
          <Input
            value={draft.socials[platform.id] ?? ""}
            onChange={(event) =>
              setSocialHandle(platform.id, event.target.value)
            }
            placeholder={`your ${platform.slug} handle`}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </Field>
      ))}
    </div>
  )
}
