"use client"

import { CameraIcon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"

function usePreview(file: File | null) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])
  return url
}

type Props = {
  logo: File | null
  cover: File | null
  existingLogoUrl: string | null
  existingCoverUrl: string | null
  onSelectLogo: (file: File | null) => void
  onSelectCover: (file: File | null) => void
}

export function BrandingUploader({
  logo,
  cover,
  existingLogoUrl,
  existingCoverUrl,
  onSelectLogo,
  onSelectCover,
}: Props) {
  const logoInput = useRef<HTMLInputElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)
  const logoPreview = usePreview(logo) ?? existingLogoUrl
  const coverPreview = usePreview(cover) ?? existingCoverUrl

  return (
    <div className="relative mb-12">
      <button
        type="button"
        aria-label={coverPreview ? "Change cover photo" : "Add cover photo"}
        onClick={() => coverInput.current?.click()}
        className="bg-muted relative block h-40 w-full overflow-hidden rounded-xl">
        {coverPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPreview} alt="" className="size-full object-cover" />
        ) : null}
        <span className="bg-background/85 text-foreground absolute top-3 right-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium">
          <CameraIcon className="size-3.5" />
          {coverPreview ? "Change cover" : "Add cover"}
        </span>
      </button>

      <button
        type="button"
        aria-label={logoPreview ? "Change logo" : "Add logo"}
        onClick={() => logoInput.current?.click()}
        className="absolute -bottom-10 left-4 size-24">
        <span className="border-background bg-muted block size-full overflow-hidden rounded-2xl border-4">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPreview} alt="" className="size-full object-cover" />
          ) : null}
        </span>
        <span className="border-background bg-primary absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2">
          <CameraIcon className="text-primary-foreground size-3.5" />
        </span>
      </button>

      <input
        ref={coverInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onSelectCover(event.target.files?.[0] ?? null)}
      />
      <input
        ref={logoInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onSelectLogo(event.target.files?.[0] ?? null)}
      />
    </div>
  )
}
