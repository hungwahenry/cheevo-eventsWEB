import {
  useCreateEventFeature,
  useUpdateEventFeature,
} from "@/features/organizer/events/hooks/use-feature-mutations"
import type { EventFeature } from "@/features/organizer/events/types"
import type { EventFeatureInput } from "@/features/organizer/events/validation"
import { eventFeatureSchema } from "@/features/organizer/events/validation"
import { applyApiErrors } from "@/lib/api"
import { toLocalInputValue } from "@/lib/format/datetime"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type Options = {
  eventId: string
  feature: EventFeature | null
  isOpen: boolean
  onSuccess?: () => void
}

function defaults(feature: EventFeature | null): EventFeatureInput {
  return {
    title: feature?.title ?? "",
    description: feature?.description ?? "",
    link: feature?.link ?? "",
    starts_at: toLocalInputValue(feature?.starts_at ?? null),
    ends_at: toLocalInputValue(feature?.ends_at ?? null),
  }
}

const orNull = (value: string) => (value === "" ? null : value)

export function useFeatureForm({
  eventId,
  feature,
  isOpen,
  onSuccess,
}: Options) {
  const create = useCreateEventFeature(eventId)
  const update = useUpdateEventFeature(eventId, feature?.id ?? "")
  const mutation = feature ? update : create

  const form = useForm<EventFeatureInput>({
    resolver: zodResolver(eventFeatureSchema),
    defaultValues: defaults(feature),
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    form.reset(defaults(feature))
    setImageFile(null)
    setImagePreview(null)
  }, [isOpen, feature, form])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const pickImage = (file: File) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const submit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        title: values.title.trim(),
        description: orNull(values.description.trim()) ?? undefined,
        link: orNull(values.link.trim()) ?? undefined,
        starts_at: orNull(values.starts_at) ?? undefined,
        ends_at: orNull(values.ends_at) ?? undefined,
        image: imageFile,
      })
      onSuccess?.()
    } catch (error) {
      applyApiErrors(form, error)
    }
  })

  return {
    form,
    submit,
    isSubmitting: mutation.isPending,
    previewUrl: imagePreview ?? feature?.image_url ?? null,
    pickImage,
    isEdit: feature !== null,
  }
}
