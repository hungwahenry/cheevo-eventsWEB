import { CheckIcon, MailIcon, UsersIcon } from "lucide-react"

const SENT = [
  {
    title: "Doors open at 4 PM sharp",
    body: "Reminder: gates open 4 PM. Bring your ID + QR code, see you on the rooftop.",
    sent: "2 days ago",
    reach: "1,103 attendees",
  },
  {
    title: "Last call for VIP tables",
    body: "Only 3 VIP tables left for Saturday. Tap to grab yours before they're gone.",
    sent: "1 week ago",
    reach: "1,103 attendees",
  },
]

export function BroadcastsSection() {
  return (
    <section className="bg-foreground/[0.02] px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            Talk to your crowd
          </p>
          <h2 className="max-w-2xl text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            One email, every attendee&rsquo;s inbox.
          </h2>
          <p className="max-w-xl text-base text-foreground/65">
            Send doors-open reminders, last-call promos, schedule
            changes — straight to the people who RSVP&rsquo;d or grabbed
            a ticket. No mailing lists, no DM threads.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComposerCard />
          <SentList />
        </div>
      </div>
    </section>
  )
}

function ComposerCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.15)] md:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight">New broadcast</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] font-medium text-foreground/70">
          <UsersIcon className="size-3" />
          1,103 attendees
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/55">
          Subject
        </label>
        <div className="rounded-lg border border-foreground/10 bg-background/60 px-3 py-2.5 text-sm">
          Doors open at 4 PM sharp
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/55">
          Message
        </label>
        <div className="rounded-lg border border-foreground/10 bg-background/60 px-3 py-2.5 text-sm leading-relaxed text-foreground/75">
          Reminder: gates open 4 PM. Bring your ID + QR code, and we&rsquo;ll
          see you on the rooftop. ☀️
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2">
        <span className="text-[11px] text-foreground/55">
          Sends as an email.
        </span>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
          <MailIcon className="size-3.5" />
          Send broadcast
        </button>
      </div>
    </div>
  )
}

function SentList() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold tracking-tight">Recent broadcasts</p>
        <span className="text-xs text-foreground/55">For Sundown · 04</span>
      </div>
      <ul className="flex flex-col gap-3 divide-y divide-foreground/5">
        {SENT.map((b, i) => (
          <li
            key={b.title}
            className={"flex flex-col gap-1.5 " + (i > 0 ? "pt-3" : "")}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{b.title}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckIcon className="size-3" />
                Delivered
              </span>
            </div>
            <p className="line-clamp-2 text-xs text-foreground/65">{b.body}</p>
            <p className="text-[11px] text-foreground/45">
              {b.sent} &middot; {b.reach}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
