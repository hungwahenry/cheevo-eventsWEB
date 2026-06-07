import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function MarketingHeader() {
  return (
    <header className="relative z-20 px-6 py-5 md:px-10 md:py-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link href="/" aria-label="cheevo" className="inline-flex items-center">
          <Image
            src="/images/logo.png"
            alt="cheevo organizers"
            width={1024}
            height={256}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>
        <Button
          asChild
          size="sm"
          className="rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/login">Get started</Link>
        </Button>
      </div>
    </header>
  )
}
