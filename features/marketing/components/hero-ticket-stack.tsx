"use client"

import QRCode from "react-qr-code"

type Ticket = {
  title: string
  meta: string
  price: string
  code: string
}

const TICKETS: Ticket[] = [
  {
    title: "Sundown · The Day Party",
    meta: "Sat 12 Jul · Lekki, Lagos",
    price: "₦5,000",
    code: "cheevo:sundown-day-party",
  },
  {
    title: "Founders Summit '26",
    meta: "Fri 5 Sep · Victoria Island",
    price: "₦12,000",
    code: "cheevo:founders-summit-26",
  },
]

export function HeroTicketStack({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-md">
        <TicketCard
          ticket={TICKETS[1]}
          className="absolute inset-x-6 top-12 -rotate-6 opacity-70 blur-[0.5px]"
        />
        <TicketCard
          ticket={TICKETS[0]}
          featured
          className="relative rotate-[-1.5deg]"
        />
      </div>
    </div>
  )
}

function TicketCard({
  ticket,
  featured = false,
  className = "",
}: {
  ticket: Ticket
  featured?: boolean
  className?: string
}) {
  return (
    <div
      className={
        "rounded-2xl border border-foreground/10 bg-card " +
        (featured ? "shadow-[0_24px_60px_-32px_rgba(0,0,0,0.25)] " : "") +
        className
      }
    >
      <div className="flex flex-col gap-3 p-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Admit one
        </span>
        <p className="text-lg font-semibold leading-tight tracking-tight">
          {ticket.title}
        </p>
        <p className="text-sm text-foreground/55">{ticket.meta}</p>
      </div>

      <Perforation />

      <div className="flex items-center justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/45">
            Price
          </span>
          <span className="text-2xl font-bold tracking-tight tabular-nums">
            {ticket.price}
          </span>
          <span className="text-xs text-foreground/55">Scan at the door</span>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-background p-2.5">
          <QRCode
            value={ticket.code}
            size={76}
            bgColor="transparent"
            fgColor="currentColor"
            className="text-foreground"
          />
        </div>
      </div>
    </div>
  )
}

function Perforation() {
  return (
    <div className="relative h-0">
      <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-background" />
      <span className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-background" />
      <div className="mx-4 border-t border-dashed border-foreground/15" />
    </div>
  )
}
