import { ShieldCheckIcon } from "lucide-react"

const MEMBERS = [
  { name: "Tomi Adeyemi", role: "Owner", initials: "TA", since: "Founded 2025" },
  { name: "Ada Eze", role: "Member", initials: "AE", since: "Joined Mar 2026" },
  { name: "Femi Okoro", role: "Member", initials: "FO", since: "Joined Apr 2026" },
  { name: "Bisola K.", role: "Member", initials: "BK", since: "Joined Apr 2026" },
]

export function TeamSection() {
  return (
    <section className="bg-foreground/[0.02] px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            Built for teams
          </p>
          <h2 className="max-w-md text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            Bring your team along.
          </h2>
          <p className="max-w-md text-base text-foreground/65">
            Invite the people who help you run events — co-founders,
            promoters, door staff. Everyone signs in with their own
            account and works from the same dashboard.
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-foreground/70">
            <ShieldCheckIcon className="size-4 text-primary" />
            Owner controls who&rsquo;s in. Remove anyone, anytime.
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold tracking-tight">Team</p>
            <span className="text-xs text-foreground/55">4 members</span>
          </div>
          <ul className="flex flex-col gap-3 divide-y divide-foreground/5">
            {MEMBERS.map((m, i) => (
              <li
                key={m.name}
                className={
                  "flex items-center justify-between gap-3 " +
                  (i > 0 ? "pt-3" : "")
                }
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-xs font-semibold">
                    {m.initials}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-[11px] text-foreground/55">{m.since}</p>
                  </div>
                </div>
                <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] font-medium text-foreground/70">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
