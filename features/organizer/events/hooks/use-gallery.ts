import {
  useAddEventImage,
  useDeleteEventImage,
  useReorderEventImages,
} from "@/features/organizer/events/hooks/use-gallery-mutations"
import type { EventImage } from "@/features/organizer/events/types"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"

export function useGallery(eventId: string, initial: EventImage[]) {
  const add = useAddEventImage(eventId)
  const remove = useDeleteEventImage(eventId)
  const reorder = useReorderEventImages(eventId)

  const [items, setItems] = useState<EventImage[]>(initial)

  useEffect(() => {
    setItems(initial)
  }, [initial])

  const uploadFiles = (files: File[]) => {
    for (const file of files) add.mutate(file)
  }

  const deleteImage = (id: string) => {
    setItems((prev) => prev.filter((image) => image.id !== id))
    remove.mutate(id)
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((image) => image.id === active.id)
    const newIndex = items.findIndex((image) => image.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)
    reorder.mutate(next.map((image) => image.id))
  }

  return {
    items,
    uploadFiles,
    deleteImage,
    onDragEnd,
    isUploading: add.isPending,
  }
}
