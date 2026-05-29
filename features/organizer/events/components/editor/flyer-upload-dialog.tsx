"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useFlyerUpload } from "@/features/organizer/events/hooks"
import { useRef } from "react"
import Cropper from "react-easy-crop"

const ACCEPTED =
  "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"

type FlyerUploadDialogProps = {
  eventId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FlyerUploadDialog({
  eventId,
  open,
  onOpenChange,
}: FlyerUploadDialogProps) {
  const flyer = useFlyerUpload(eventId, {
    isOpen: open,
    onSuccess: () => onOpenChange(false),
  })
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload flyer</DialogTitle>
          <DialogDescription>
            Image (cropped to 4:5) or a short vertical video.
          </DialogDescription>
        </DialogHeader>

        {!flyer.src ? (
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            Pick a file
          </Button>
        ) : flyer.kind === "image" ? (
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
              <Cropper
                image={flyer.src}
                crop={flyer.crop}
                zoom={flyer.zoom}
                aspect={4 / 5}
                onCropChange={flyer.setCrop}
                onZoomChange={flyer.setZoom}
                onCropComplete={(_, areaPixels) => flyer.setPixels(areaPixels)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Zoom</span>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={[flyer.zoom]}
                onValueChange={(values) => flyer.setZoom(values[0] ?? 1)}
              />
            </div>
          </div>
        ) : (
          <video
            src={flyer.src}
            controls
            className="aspect-[4/5] w-full rounded-lg bg-muted object-cover"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(event) => {
            const picked = event.target.files?.[0]
            if (picked) flyer.pickFile(picked)
          }}
        />

        {flyer.errorMessage ? (
          <p className="text-sm text-destructive">{flyer.errorMessage}</p>
        ) : null}

        <DialogFooter className="gap-2">
          {flyer.src ? (
            <Button variant="ghost" onClick={() => inputRef.current?.click()}>
              Change file
            </Button>
          ) : null}
          <Button
            onClick={flyer.submit}
            disabled={!flyer.file || flyer.isUploading}
          >
            {flyer.isUploading ? "Uploading…" : "Use"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
