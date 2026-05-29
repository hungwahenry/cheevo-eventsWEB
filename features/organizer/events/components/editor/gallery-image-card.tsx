"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { EventImage } from "@/features/organizer/events/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon, Trash2Icon } from "lucide-react"

type GalleryImageCardProps = {
  image: EventImage
  onDelete: (id: string) => void
}

export function GalleryImageCard({ image, onDelete }: GalleryImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
    >
      <img src={image.url} alt="" className="size-full object-cover" />

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="absolute top-2 left-2 flex size-7 cursor-grab items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-4" />
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            aria-label="Delete image"
            className="absolute top-2 right-2 size-7 opacity-0 transition group-hover:opacity-100"
          >
            <Trash2Icon className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the image from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(image.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
