"use client"

import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"
import { toast } from "sonner"

const WEB_URL = "https://cheevo.events"

export function CopyEventLinkButton({ slug }: { slug: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${WEB_URL}/events/${slug}`)
      toast.success("Event link copied.")
    } catch {
      toast.error("Couldn't copy the link.")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      <LinkIcon className="size-4" />
      <span className="hidden sm:inline">Copy link</span>
    </Button>
  )
}
