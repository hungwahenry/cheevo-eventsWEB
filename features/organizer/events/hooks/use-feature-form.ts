import type { FeatureInput } from "@/features/organizer/events/api"
import {
  useCreateEventFeature,
  useUpdateEventFeature,
} from "@/features/organizer/events/hooks/use-feature-mutations"
import type { EventFeature } from "@/features/organizer/events/types"
import { isApiError } from "@/lib/api"
import { useEffect, useState } from "react"

type FormState = {
  title: string
  description: string
  link: string
  starts_at: string
  ends_at: string
}

type Options = {
  eventId: string
  feature: EventFeature | null
  isOpen: boolean
  onSuccess?: () => void
}

function blank(): FormState {
  return { title: "", description: "", link: "", starts_at: "", ends_at: "" }
}

function fromFeature(feature: EventFeature): FormState {
  return {
    title: feature.title,
    description: feature.description ?? "",
    link: feature.link ?? "",
    starts_at: toLocalInput(feature.starts_at),
    ends_at: toLocalInput(feature.ends_at),
  }
}

export function useFeatureForm({
  eventId,
  feature,
  isOpen,
  onSuccess,
}: Options) {
  const create = useCreateEventFeature(eventId)
  const update = useUpdateEventFeature(eventId, feature?.id ?? "")

  const [form, setForm] = useState<FormState>(() =>
    feature ? fromFeature(feature) : blank()
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setForm(feature ? fromFeature(feature) : blank())
    setImageFile(null)
    setImagePreview(null)
  }, [isOpen, feature])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const pickImage = (file: File) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const submit = () => {
    const input: FeatureInput = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      link: form.link.trim() || undefined,
      starts_at: form.starts_at || undefined,
      ends_at: form.ends_at || undefined,
      image: imageFile,
    }
    const mutation = feature ? update : create
    mutation.mutate(input, { onSuccess: () => onSuccess?.() })
  }

  const mutation = feature ? update : create
  const errorMessage =
    mutation.error && isApiError(mutation.error) ? mutation.error.message : null

  const existingImageUrl = feature?.image_url ?? null
  const previewUrl = imagePreview ?? existingImageUrl

  return {
    form,
    set,
    previewUrl,
    pickImage,
    submit,
    isSubmitting: mutation.isPending,
    canSubmit: form.title.trim().length > 0 && !mutation.isPending,
    errorMessage,
    isEdit: feature !== null,
  }
}

function toLocalInput(iso: string | null): string {
  if (!iso) return ""
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
