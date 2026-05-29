"use client"

import { Input } from "@/components/ui/input"
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react"

type SlugStatus = {
  isChecking: boolean
  available?: boolean
}

type SlugFieldProps = {
  value: string
  onChange: (value: string) => void
  status: SlugStatus
}

export function SlugField({ value, onChange, status }: SlugFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">cheevo.app/</span>
      <div className="relative flex-1">
        <Input
          id="slug"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="lagos-nightlife"
          autoCapitalize="none"
          autoCorrect="off"
          className="pr-9"
        />
        <span className="absolute top-1/2 right-3 -translate-y-1/2">
          {status.isChecking ? (
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          ) : status.available === true ? (
            <CheckIcon className="size-4 text-green-600" />
          ) : status.available === false ? (
            <XIcon className="size-4 text-destructive" />
          ) : null}
        </span>
      </div>
    </div>
  )
}
