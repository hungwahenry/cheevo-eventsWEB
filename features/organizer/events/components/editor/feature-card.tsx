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
import type { EventFeature } from "@/features/organizer/events/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVerticalIcon,
  ImageIcon,
  LinkIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

type FeatureCardProps = {
  feature: EventFeature
  onEdit: (feature: EventFeature) => void
  onDelete: (id: string) => void
}

export function FeatureCard({ feature, onEdit, onDelete }: FeatureCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const timeWindow = formatRange(feature.starts_at, feature.ends_at)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-xl border bg-card p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-4" />
      </button>

      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        {feature.image_url ? (
          <img
            src={feature.image_url}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon className="size-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-medium">{feature.title}</p>
        {feature.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {feature.description}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {timeWindow ? <span>{timeWindow}</span> : null}
          {feature.link ? (
            <span className="inline-flex items-center gap-1">
              <LinkIcon className="size-3" />
              <span className="truncate">{feature.link}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Edit"
          onClick={() => onEdit(feature)}
        >
          <PencilIcon className="size-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this feature?</AlertDialogTitle>
              <AlertDialogDescription>
                "{feature.title}" will be removed from the event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(feature.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

function formatRange(
  starts: string | null,
  ends: string | null
): string | null {
  if (!starts && !ends) return null
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
  if (starts && ends) {
    return `${formatter.format(new Date(starts))} → ${formatter.format(new Date(ends))}`
  }
  if (starts) return `From ${formatter.format(new Date(starts))}`
  if (ends) return `Until ${formatter.format(new Date(ends!))}`
  return null
}
