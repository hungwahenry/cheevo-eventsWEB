import Link from "next/link"

import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.03em]">
          Your next event is one click away.
        </h2>
        <p className="max-w-xl text-base text-foreground/65 md:text-lg">
          Free to start. No setup fees. Sign in, create your
          organisation, ship your event.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/login">Start hosting</Link>
          </Button>
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}
