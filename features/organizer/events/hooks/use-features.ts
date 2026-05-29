import {
  useDeleteEventFeature,
  useReorderEventFeatures,
} from "@/features/organizer/events/hooks/use-feature-mutations"
import type { EventFeature } from "@/features/organizer/events/types"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"

export function useFeatures(eventId: string, initial: EventFeature[]) {
  const remove = useDeleteEventFeature(eventId)
  const reorder = useReorderEventFeatures(eventId)

  const [items, setItems] = useState<EventFeature[]>(initial)

  useEffect(() => {
    setItems(initial)
  }, [initial])

  const deleteFeature = (id: string) => {
    setItems((prev) => prev.filter((feature) => feature.id !== id))
    remove.mutate(id)
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((feature) => feature.id === active.id)
    const newIndex = items.findIndex((feature) => feature.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)
    reorder.mutate(next.map((feature) => feature.id))
  }

  return {
    items,
    deleteFeature,
    onDragEnd,
  }
}
