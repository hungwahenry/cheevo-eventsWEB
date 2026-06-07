import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative px-6 pb-20 pt-10 md:px-10 md:pb-32 md:pt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
          Cheevo for organisers
        </p>
        <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,5rem)] font-black leading-[1.02] tracking-[-0.035em]">
          Sell tickets.
          <br />
          Get paid. <span className="text-primary">Move on.</span>
        </h1>
        <p className="max-w-xl text-base text-foreground/65 md:text-lg">
          All-in-one event hosting for Nigeria — tickets, payouts, broadcasts,
          door scanning, attendees. One dashboard, no spreadsheets.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/login">Start hosting</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
