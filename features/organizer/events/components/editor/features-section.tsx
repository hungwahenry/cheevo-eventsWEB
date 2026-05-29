"use client"

import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/features/organizer/events/components/editor/feature-card"
import { FeatureFormDialog } from "@/features/organizer/events/components/editor/feature-form-dialog"
import { useFeatures } from "@/features/organizer/events/hooks"
import type { EventFeature, EventItem } from "@/features/organizer/events/types"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { PlusIcon, SparklesIcon } from "lucide-react"
import { useState } from "react"

export function FeaturesSection({ event }: { event: EventItem }) {
  const features = useFeatures(event.id, event.features ?? [])
  const [editing, setEditing] = useState<EventFeature | null>(null)
  const [open, setOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const openCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const openEdit = (feature: EventFeature) => {
    setEditing(feature)
    setOpen(true)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Features</h2>
        <Button type="button" variant="outline" size="sm" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Add feature
        </Button>
      </div>

      {features.items.length === 0 ? (
        <button
          type="button"
          onClick={openCreate}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-10 text-sm text-muted-foreground transition hover:bg-muted/40"
        >
          <SparklesIcon className="size-5" />
          <span>Highlight things that make this event special</span>
        </button>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={features.onDragEnd}
        >
          <SortableContext
            items={features.items.map((feature) => feature.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {features.items.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onEdit={openEdit}
                  onDelete={features.deleteFeature}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <FeatureFormDialog
        eventId={event.id}
        feature={editing}
        open={open}
        onOpenChange={setOpen}
      />
    </section>
  )
}
