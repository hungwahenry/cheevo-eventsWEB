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
import { ImageIcon, MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function statusLabel(status: EventItem["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function EventTableRow({ event }: { event: EventItem }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const remove = useDeleteEvent()
  const href = `/organizer/events/${event.id}/edit`

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

        <TableCell className="w-28">
          <Badge
            variant={event.status === "published" ? "default" : "secondary"}
          >
            {statusLabel(event.status)}
          </Badge>
        </TableCell>

        <TableCell className="w-36 text-sm text-muted-foreground">
          {formatDate(event.starts_at)}
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
