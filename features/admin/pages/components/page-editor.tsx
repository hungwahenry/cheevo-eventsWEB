"use client"

import { RichTextEditor } from "@/components/rich-text-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  useDeletePage,
  usePage,
  usePublishPage,
  useUnpublishPage,
  useUpdatePage,
} from "@/features/admin/pages/hooks"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function PageEditor({ id }: { id: string }) {
  const router = useRouter()
  const { data: page, isLoading } = usePage(id)
  const update = useUpdatePage()
  const publish = usePublishPage()
  const unpublish = useUnpublishPage()
  const del = useDeletePage()

  // Local-only state. Synced from the server *once* on first load; after that
  // the server is updated by Save and the cache is patched in-place, so
  // local state is never reset under the user.
  const [slug, setSlug] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [editingSlug, setEditingSlug] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const hydratedRef = useRef(false)
  useEffect(() => {
    if (!hydratedRef.current && page) {
      setSlug(page.slug)
      setTitle(page.title)
      setBody(page.body_html)
      setMetaDescription(page.meta_description ?? "")
      hydratedRef.current = true
    }
  }, [page])

  const lastSavedRef = useRef<string>("")
  useEffect(() => {
    if (page) {
      lastSavedRef.current = serialize(
        page.slug,
        page.title,
        page.body_html,
        page.meta_description ?? ""
      )
    }
  }, [page])

  const current = serialize(slug, title, body, metaDescription)
  const isDirty = hydratedRef.current && current !== lastSavedRef.current

  const save = () => {
    if (!isDirty || update.isPending) return
    update.mutate({
      id,
      payload: {
        slug,
        title,
        body_html: body,
        meta_description: metaDescription.trim() || null,
      },
    })
  }

  if (isLoading || !page) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const togglePublish = () => {
    if (page.is_published) {
      unpublish.mutate(page.id)
    } else {
      publish.mutate(page.id)
    }
  }

  const apiBase =
    typeof window !== "undefined" ? window.location.origin : ""
  const liveUrl = `${apiBase}/${page.slug}`

  return (
    <div className="flex flex-col">
      {/* Sticky header — back, status, publish action, more menu. */}
      <div className="bg-background sticky top-0 z-10 flex items-center gap-3 border-b px-6 py-3">
        <Link
          href="/admin/pages"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ChevronLeftIcon className="size-4" /> Pages
        </Link>

        <div className="flex-1" />

        <SaveStatus
          isDirty={isDirty}
          isSaving={update.isPending}
          updatedAt={page.updated_at}
        />

        {page.is_published ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
          >
            View live <ExternalLinkIcon className="size-3" />
          </a>
        ) : null}

        <Button
          size="sm"
          variant="outline"
          onClick={save}
          disabled={!isDirty || update.isPending}
        >
          Save
        </Button>

        <Button
          size="sm"
          variant={page.is_published ? "outline" : "default"}
          onClick={togglePublish}
          disabled={publish.isPending || unpublish.isPending}
        >
          {page.is_published ? "Unpublish" : "Publish"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(liveUrl)}
            >
              Copy public URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete page
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Document body. */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <div className="flex items-center gap-2">
          <PageStatus published={page.is_published} />
          {page.published_at ? (
            <span className="text-muted-foreground text-xs">
              First published{" "}
              {new Date(page.published_at).toLocaleDateString()}
            </span>
          ) : null}
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="placeholder:text-muted-foreground/60 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none"
          maxLength={200}
          aria-label="Title"
        />

        <SlugField
          slug={slug}
          editing={editingSlug}
          onStartEdit={() => setEditingSlug(true)}
          onChange={(v) => setSlug(sanitizeSlug(v))}
          onBlur={() => setEditingSlug(false)}
        />

        <RichTextEditor value={body} onChange={(html) => setBody(html)} />

        <Collapsible className="mt-4 rounded-md border">
          <CollapsibleTrigger className="hover:bg-muted/40 flex w-full items-center justify-between rounded-md px-4 py-3 text-left text-sm font-medium transition">
            SEO
            <ChevronDownIcon className="size-4 transition data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t px-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="meta" className="text-sm">
                Meta description
              </label>
              <Textarea
                id="meta"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Short summary shown in search results."
              />
              <p className="text-muted-foreground text-xs">
                {metaDescription.length}/300
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${page.title}"?`}
        description="Hard-deletes the page. Anyone visiting the public URL will see a 404."
        confirmLabel="Delete"
        destructive
        isSubmitting={del.isPending}
        onConfirm={() => {
          del.mutate(page.id, {
            onSuccess: () => {
              setDeleteOpen(false)
              router.push("/admin/pages")
            },
          })
        }}
      />
    </div>
  )
}

function PageStatus({ published }: { published: boolean }) {
  return published ? (
    <Badge variant="default">Published</Badge>
  ) : (
    <Badge variant="outline">Draft</Badge>
  )
}

function SaveStatus({
  isDirty,
  isSaving,
  updatedAt,
}: {
  isDirty: boolean
  isSaving: boolean
  updatedAt: string | null
}) {
  if (isSaving) {
    return <span className="text-muted-foreground text-xs">Saving…</span>
  }
  if (isDirty) {
    return <span className="text-muted-foreground text-xs">Unsaved changes</span>
  }
  if (updatedAt) {
    return (
      <span className="text-muted-foreground text-xs">
        Saved · {new Date(updatedAt).toLocaleTimeString()}
      </span>
    )
  }
  return null
}

function SlugField({
  slug,
  editing,
  onStartEdit,
  onChange,
  onBlur,
}: {
  slug: string
  editing: boolean
  onStartEdit: () => void
  onChange: (value: string) => void
  onBlur: () => void
}) {
  if (!editing) {
    return (
      <button
        onClick={onStartEdit}
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 font-mono text-xs transition"
      >
        /{slug || "—"}
        <PencilIcon className="size-3" />
      </button>
    )
  }
  return (
    <div className="border-input bg-background flex w-fit items-center overflow-hidden rounded-md border">
      <span className="text-muted-foreground bg-muted/40 border-input border-r px-2 py-1 font-mono text-xs">
        /
      </span>
      <Input
        value={slug}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        autoFocus
        className="h-7 w-64 rounded-none border-0 font-mono text-xs focus-visible:ring-0"
        maxLength={80}
      />
    </div>
  )
}

function serialize(
  slug: string,
  title: string,
  body: string,
  meta: string
): string {
  return JSON.stringify({ slug, title, body, meta: meta.trim() })
}

function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}
