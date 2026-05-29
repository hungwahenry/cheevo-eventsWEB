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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { useDeleteEvent } from "@/features/organizer/events/hooks"
import type { EventItem } from "@/features/organizer/events/types"
import { ImageIcon, MapPinIcon, MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
}

function formatWhen(starts: string | null, ends: string | null) {
  if (!starts && !ends) return { date: "—", time: null as string | null }
  if (!starts && ends) {
    const e = new Date(ends)
    return {
      date: `Ends ${e.toLocaleDateString(undefined, DATE_FORMAT)}`,
      time: e.toLocaleTimeString(undefined, TIME_FORMAT),
    }
  }
  const s = new Date(starts!)
  const date = s.toLocaleDateString(undefined, DATE_FORMAT)
  const startTime = s.toLocaleTimeString(undefined, TIME_FORMAT)
  if (!ends) return { date, time: startTime }
  const e = new Date(ends)
  const sameDay = s.toDateString() === e.toDateString()
  if (sameDay) {
    return {
      date,
      time: `${startTime} – ${e.toLocaleTimeString(undefined, TIME_FORMAT)}`,
    }
  }
  return {
    date: `${date} → ${e.toLocaleDateString(undefined, DATE_FORMAT)}`,
    time: startTime,
  }
}

function statusLabel(status: EventItem["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function EventTableRow({ event }: { event: EventItem }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const remove = useDeleteEvent()
  const href = `/organizer/events/${event.id}/edit`
  const when = formatWhen(event.starts_at, event.ends_at)

  return (
    <>
      <TableRow className="hover:bg-muted/40">
        <TableCell>
          <Link href={href} className="flex items-center gap-3">
            <div className="relative h-12 w-[2.4rem] shrink-0 overflow-hidden rounded bg-muted">
              {event.flyer_url ? (
                <img
                  src={event.flyer_url}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-3.5" />
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {event.title}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                /{event.slug}
              </span>
            </div>
          </Link>
        </TableCell>

        <TableCell className="hidden w-56 md:table-cell">
          {event.venue_name || event.city ? (
            <div className="flex items-start gap-1.5 text-sm">
              <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate">{event.venue_name ?? "—"}</span>
                {event.city ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {event.city}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </TableCell>

        <TableCell className="w-44">
          <div className="flex flex-col text-sm">
            <span>{when.date}</span>
            {when.time ? (
              <span className="text-xs text-muted-foreground">{when.time}</span>
            ) : null}
          </div>
        </TableCell>

        <TableCell className="w-28">
          <Badge
            variant={event.status === "published" ? "default" : "secondary"}
          >
            {statusLabel(event.status)}
          </Badge>
        </TableCell>

        <TableCell className="w-12 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Row actions">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={href}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{event.title}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the event and its media. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove.mutate(event.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
