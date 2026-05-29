"use client"

import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import type { SocialPlatform } from "@/features/organizer/onboarding/types"
import { normalizeSocialHandle } from "@/features/organizer/onboarding/validation"

function displayPrefix(baseUrl: string): string {
  return baseUrl.replace(/^https?:\/\//, "")
}

type SocialHandleFieldProps = {
  platform: SocialPlatform
  value: string
  onChange: (value: string) => void
}

export function SocialHandleField({
  platform,
  value,
  onChange,
}: SocialHandleFieldProps) {
  if (!platform.base_url) {
    return (
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://your-site.com"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
      />
    )
  }

  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>{displayPrefix(platform.base_url)}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(event) =>
          onChange(
            normalizeSocialHandle(event.target.value, platform.base_url!)
          )
        }
        placeholder="handle"
        autoCapitalize="none"
        autoCorrect="off"
      />
    </InputGroup>
  )
}
