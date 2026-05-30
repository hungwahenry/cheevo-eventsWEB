import { useUpdateFlyer } from "@/features/organizer/events/hooks/use-event-mutations"
import { isApiError } from "@/lib/api"
import { useEffect, useRef, useState } from "react"
import type { Area } from "react-easy-crop"

type Kind = "image" | "video"
type Point = { x: number; y: number }

type Options = {
  isOpen: boolean
  onSuccess?: () => void
}

export function useFlyerUpload(
  eventId: string,
  { isOpen, onSuccess }: Options
) {
  const update = useUpdateFlyer(eventId)

  const [file, setFile] = useState<File | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [kind, setKind] = useState<Kind | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const pixelsRef = useRef<Area | null>(null)

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src)
    }
  }, [src])

  useEffect(() => {
    if (isOpen) return
    setFile(null)
    setSrc(null)
    setKind(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    pixelsRef.current = null
  }, [isOpen])

  const pickFile = (picked: File) => {
    if (src) URL.revokeObjectURL(src)
    setFile(picked)
    setSrc(URL.createObjectURL(picked))
    setKind(picked.type.startsWith("video/") ? "video" : "image")
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    pixelsRef.current = null
  }

  const setPixels = (area: Area) => {
    pixelsRef.current = area
  }

  const submit = async () => {
    if (!file) return
    let toUpload = file
    if (kind === "image" && pixelsRef.current && src) {
      const blob = await cropToJpeg(src, pixelsRef.current)
      toUpload = new File([blob], replaceExt(file.name, "jpg"), {
        type: "image/jpeg",
      })
    }
    update.mutate(toUpload, { onSuccess: () => onSuccess?.() })
  }

  const errorMessages =
    update.error && isApiError(update.error) ? update.error.messages() : []

  return {
    file,
    src,
    kind,
    crop,
    zoom,
    setCrop,
    setZoom,
    setPixels,
    pickFile,
    submit,
    isUploading: update.isPending,
    errorMessages,
  }
}

async function cropToJpeg(src: string, pixels: Area): Promise<Blob> {
  const image = await loadImage(src)
  const canvas = document.createElement("canvas")
  canvas.width = pixels.width
  canvas.height = pixels.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D unavailable.")
  ctx.drawImage(
    image,
    pixels.x,
    pixels.y,
    pixels.width,
    pixels.height,
    0,
    0,
    pixels.width,
    pixels.height
  )
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed."))),
      "image/jpeg",
      0.92
    )
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Image failed to load."))
    image.src = src
  })
}

function replaceExt(name: string, ext: string): string {
  return name.replace(/\.[^.]+$/, "") + "." + ext
}
