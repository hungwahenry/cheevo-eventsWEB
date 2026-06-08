"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FlyerUploadDialog } from "@/features/organizer/events/components/editor/flyer-upload-dialog"
import { useUpdateFlyer } from "@/features/organizer/events/hooks/use-event-mutations"
import type { EventItem } from "@/features/organizer/events/types"
import { useEffect, useState } from "react"

export function FlyerSection({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const update = useUpdateFlyer(event.id)
  const uploading = update.isPending

  useEffect(() => {
    if (!uploading) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [uploading])

  const startUpload = (file: File) => {
    setOpen(false)
    setProgress(0)
    update.mutate({ file, onProgress: setProgress })
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">Flyer</h2>
      <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
        {event.flyer_url ? (
          event.flyer_type === "video" ? (
            <video
              src={event.flyer_url}
              className="size-full object-cover"
              controls
            />
          ) : (
            <img
              src={event.flyer_url}
              alt=""
              className="size-full object-cover"
            />
          )
        ) : (
          <p className="text-sm text-muted-foreground">No flyer yet</p>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 px-6 backdrop-blur-sm">
            <p className="text-sm font-medium">Uploading flyer…</p>
            <Progress value={progress} className="w-full max-w-[180px]" />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        ) : null}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setOpen(true)}
        disabled={uploading}
      >
        {event.flyer_url ? "Change flyer" : "Upload flyer"}
      </Button>
      <FlyerUploadDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={startUpload}
      />
    </div>
  )
}
