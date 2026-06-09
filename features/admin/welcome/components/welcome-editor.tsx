"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  useUpdateWelcomeContent,
  useWelcomeContent,
} from "@/features/admin/welcome/hooks"
import { ImageIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function WelcomeEditor() {
  const { data, isLoading } = useWelcomeContent()
  const update = useUpdateWelcomeContent()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [headline, setHeadline] = useState("")
  const [subheadline, setSubheadline] = useState("")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [clearOpen, setClearOpen] = useState(false)

  useEffect(() => {
    if (data) {
      setHeadline(data.headline)
      setSubheadline(data.subheadline)
    }
  }, [data])

  useEffect(() => {
    if (!pendingFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(pendingFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [pendingFile])

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const currentBg = previewUrl ?? data.background_url
  const hasTextChanges =
    headline !== data.headline || subheadline !== data.subheadline

  const saveText = () => {
    if (!hasTextChanges) return
    update.mutate({ headline, subheadline })
  }

  const uploadImage = () => {
    if (!pendingFile) return
    update.mutate(
      { background: pendingFile },
      { onSuccess: () => setPendingFile(null) }
    )
  }

  const clearImage = () => {
    update.mutate(
      { clear_background: true },
      { onSuccess: () => setClearOpen(false) }
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Copy</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Textarea
              id="subheadline"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              rows={3}
              maxLength={280}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setHeadline(data.headline)
                setSubheadline(data.subheadline)
              }}
              disabled={!hasTextChanges || update.isPending}
            >
              Reset
            </Button>
            <Button
              onClick={saveText}
              disabled={!hasTextChanges || update.isPending}
            >
              Save copy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Background image</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="bg-muted aspect-[3/4] w-full overflow-hidden rounded-md">
            {currentBg ? (
              <img
                src={currentBg}
                alt="Welcome background"
                className="size-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex size-full items-center justify-center text-xs">
                <ImageIcon className="size-4" />
                <span className="ml-2">No background</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
          />
          {pendingFile ? (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {pendingFile.name}
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={uploadImage}
                  disabled={update.isPending}
                >
                  Upload
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPendingFile(null)}
                  disabled={update.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={update.isPending}
            >
              <UploadIcon className="size-4" /> Choose image
            </Button>
          )}
          {data.background_url ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setClearOpen(true)}
              disabled={update.isPending}
            >
              <Trash2Icon className="size-3" /> Remove background
            </Button>
          ) : null}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Remove the background image?"
        description="The welcome screen will fall back to its default gradient until you upload a new image."
        confirmLabel="Remove"
        destructive
        isSubmitting={update.isPending}
        onConfirm={clearImage}
      />
    </div>
  )
}
