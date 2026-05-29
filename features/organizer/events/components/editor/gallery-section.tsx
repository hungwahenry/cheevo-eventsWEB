"use client"

import { Button } from "@/components/ui/button"
import { GalleryImageCard } from "@/features/organizer/events/components/editor/gallery-image-card"
import { useGallery } from "@/features/organizer/events/hooks"
import type { EventItem } from "@/features/organizer/events/types"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { ImagePlusIcon } from "lucide-react"
import { useRef } from "react"

const ACCEPTED = "image/jpeg,image/png,image/webp"

export function GallerySection({ event }: { event: EventItem }) {
  const gallery = useGallery(event.id, event.images ?? [])
  const inputRef = useRef<HTMLInputElement>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    gallery.uploadFiles(Array.from(files))
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Gallery</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={gallery.isUploading}
        >
          <ImagePlusIcon className="size-4" />
          {gallery.isUploading ? "Uploading…" : "Add images"}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {gallery.items.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-10 text-sm text-muted-foreground transition hover:bg-muted/40"
        >
          <ImagePlusIcon className="size-5" />
          <span>Add images to the gallery</span>
        </button>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={gallery.onDragEnd}
        >
          <SortableContext
            items={gallery.items.map((image) => image.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {gallery.items.map((image) => (
                <GalleryImageCard
                  key={image.id}
                  image={image}
                  onDelete={gallery.deleteImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  )
}
