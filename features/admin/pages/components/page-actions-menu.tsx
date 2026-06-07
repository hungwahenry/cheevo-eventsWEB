"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  useDeletePage,
  usePublishPage,
  useUnpublishPage,
} from "@/features/admin/pages/hooks"
import type { AdminPage } from "@/features/admin/pages/types"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export function PageActionsMenu({ page }: { page: AdminPage }) {
  const publish = usePublishPage()
  const unpublish = useUnpublishPage()
  const del = useDeletePage()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${page.slug}`
      : `/${page.slug}`

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem asChild>
            <Link href={`/admin/pages/${page.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              page.is_published
                ? unpublish.mutate(page.id)
                : publish.mutate(page.id)
            }
          >
            {page.is_published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(publicUrl)
              toast.success("Public URL copied.")
            }}
          >
            Copy public URL
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${page.title}"?`}
        description="Hard-deletes the page. Anyone visiting the public URL will see a 404."
        confirmLabel="Delete"
        destructive
        isSubmitting={del.isPending}
        onConfirm={() =>
          del.mutate(page.id, {
            onSuccess: () => setDeleteOpen(false),
          })
        }
      />
    </>
  )
}
