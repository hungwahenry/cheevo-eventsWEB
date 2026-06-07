"use client"

import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreatePage,
  usePage,
  useUpdatePage,
} from "@/features/admin/pages/hooks"
import { slugify } from "@/lib/slug"
import { ChevronDownIcon, ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Props =
  | { mode: "create" }
  | { mode: "edit"; id: string }

export function PageForm(props: Props) {
  if (props.mode === "create") return <FormShell mode="create" />

  return <EditLoader id={props.id} />
}

function EditLoader({ id }: { id: string }) {
  const { data, isLoading, error } = usePage(id)

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 p-6">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          It may have been deleted.{" "}
          <Link href="/admin/pages" className="underline">
            Back to pages
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <FormShell
      mode="edit"
      id={data.id}
      initial={{
        slug: data.slug,
        title: data.title,
        body_html: data.body_html,
        meta_description: data.meta_description ?? "",
      }}
    />
  )
}

type Initial = {
  slug: string
  title: string
  body_html: string
  meta_description: string
}

function FormShell({
  mode,
  id,
  initial,
}: {
  mode: "create" | "edit"
  id?: string
  initial?: Initial
}) {
  const router = useRouter()
  const create = useCreatePage()
  const update = useUpdatePage()

  const [title, setTitle] = useState(initial?.title ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(mode === "edit")
  const [body, setBody] = useState(initial?.body_html ?? "<p></p>")
  const [metaDescription, setMetaDescription] = useState(
    initial?.meta_description ?? ""
  )

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title))
  }, [title, slugTouched])

  const isPending = create.isPending || update.isPending
  const canSubmit = title.trim().length > 0 && slug.length > 0 && !isPending

  const submit = () => {
    if (!canSubmit) return
    const payload = {
      slug,
      title: title.trim(),
      body_html: body,
      meta_description: metaDescription.trim() || null,
    }
    const onSuccess = () => router.push("/admin/pages")
    if (mode === "create") {
      create.mutate(payload, { onSuccess })
    } else if (id) {
      update.mutate({ id, payload }, { onSuccess })
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-background sticky top-0 z-10 flex items-center gap-3 border-b px-6 py-3">
        <Link
          href="/admin/pages"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ChevronLeftIcon className="size-4" /> Pages
        </Link>

        <div className="flex-1" />

        <Button size="sm" onClick={submit} disabled={!canSubmit}>
          {isPending
            ? "Saving…"
            : mode === "create"
              ? "Create page"
              : "Save"}
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="placeholder:text-muted-foreground/60 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none"
          maxLength={200}
          aria-label="Title"
          autoFocus={mode === "create"}
        />

        <div className="border-input bg-background flex w-full items-center overflow-hidden rounded-md border md:w-fit">
          <span className="text-muted-foreground bg-muted/40 border-input border-r px-2 py-1.5 font-mono text-xs">
            /
          </span>
          <Input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(slugify(e.target.value))
            }}
            placeholder="terms-of-service"
            maxLength={80}
            className="h-8 w-full rounded-none border-0 font-mono text-xs focus-visible:ring-0 md:w-64"
            aria-label="URL slug"
          />
        </div>

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
    </div>
  )
}

