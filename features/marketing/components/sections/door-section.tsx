import { CheckCircle2Icon, QrCodeIcon } from "lucide-react"

const STATS = [
  { label: "Scanned", value: "412" },
  { label: "Pending", value: "188" },
  { label: "Door rate", value: "68%" },
]

export function DoorSection() {
  return (
    <section className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            The door experience
          </p>
          <h2 className="max-w-md text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            Scan. Verify. Wave them through.
          </h2>
          <p className="max-w-md text-base text-foreground/65">
            Every ticket is a QR. Open the app on the door staff&rsquo;s
            phone, scan, see who&rsquo;s walked in and who hasn&rsquo;t
            — in real time, across every gate.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-3 rounded-2xl border border-foreground/10 bg-card p-4 max-w-md">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ScannerMock />
        </div>
      </div>
    </section>
  )
}

function ScannerMock() {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute -right-6 top-12 z-10 rotate-3 rounded-2xl border border-foreground/10 bg-card p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <CheckCircle2Icon className="size-5" />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">Welcome, Tomi</p>
            <p className="text-[11px] text-foreground/55">
              General entry · Just now
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-card p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          Sundown · 04
        </p>
        <p className="mt-1 text-lg font-bold tracking-tight">General entry</p>
        <p className="text-xs text-foreground/55">
          Sat, May 24 &middot; 4:00 PM &middot; The Rooftop
        </p>

        <div className="my-5 flex aspect-square w-full items-center justify-center rounded-2xl bg-foreground p-6 text-background">
          <QrCodeIcon className="size-full opacity-90" strokeWidth={1.5} />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-foreground/55">
            #CHV-7F2A-9X
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-current" />
            Valid
          </span>
        </div>
      </div>
    </div>
  )
}
