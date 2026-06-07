import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react"

type Kpi = {
  label: string
  value: string
  delta: number
}

const KPIS: Kpi[] = [
  { label: "Revenue", value: "₦4.2M", delta: 12.4 },
  { label: "Tickets", value: "284", delta: 8.1 },
  { label: "Orders", value: "261", delta: 5.9 },
  { label: "RSVPs", value: "1,103", delta: 24.3 },
]

type TopEvent = {
  title: string
  revenue: string
  tickets: number
  share: number
}

const TOP_EVENTS: TopEvent[] = [
  { title: "Sundown · The Day Party", revenue: "₦2.1M", tickets: 144, share: 58 },
  { title: "Founders Summit '26", revenue: "₦1.4M", tickets: 89, share: 38 },
  { title: "The Rooftop Mixer", revenue: "₦220K", tickets: 51, share: 6 },
]

const CHART_POINTS = [
  10, 14, 18, 12, 22, 19, 28, 24, 32, 26, 36, 30, 40, 36, 46, 42, 52, 44, 58,
  50, 64, 56, 70, 62, 76, 68, 82, 76, 88, 84,
]

export function DashboardPreview() {
  return (
    <section
      id="dashboard-preview"
      className="px-6 pb-20 md:px-10 md:pb-32"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            Your business, one view
          </p>
          <h2 className="max-w-2xl text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            See every ticket, every shilling.
          </h2>
          <p className="max-w-xl text-base text-foreground/65">
            A live dashboard that shows what&rsquo;s selling, what&rsquo;s
            settling, and what&rsquo;s coming up next. No spreadsheets.
          </p>
        </div>

        <DashboardFrame>
          <KpiRow />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <TopEventsList />
          </div>
        </DashboardFrame>
      </div>
    </section>
  )
}

function DashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18),0_10px_30px_-15px_rgba(0,0,0,0.08)] md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-foreground/10 pb-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold tracking-tight">
            Welcome, Tomi
          </p>
          <p className="text-xs text-foreground/55">
            How your events are performing.
          </p>
        </div>
        <RangeSelectorMock />
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function RangeSelectorMock() {
  const RANGES = ["7d", "30d", "90d", "12mo"]
  const active = "30d"
  return (
    <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 p-1">
      {RANGES.map((r) => (
        <span
          key={r}
          className={
            r === active
              ? "rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background"
              : "px-3 py-1 text-[10px] font-medium text-foreground/55"
          }
        >
          {r}
        </span>
      ))}
    </div>
  )
}

function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  )
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.delta >= 0
  const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon
  return (
    <div className="rounded-xl border border-foreground/10 bg-background/60 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/55">
        {kpi.label}
      </p>
      <p className="mt-2 text-xl font-bold tracking-tight tabular-nums lg:text-2xl">
        {kpi.value}
      </p>
      <div
        className={
          "mt-2 inline-flex items-center gap-1 text-[11px] font-medium " +
          (up ? "text-emerald-600" : "text-destructive")
        }
      >
        <Icon className="size-3" />
        <span>{Math.abs(kpi.delta).toFixed(1)}%</span>
        <span className="text-foreground/50">vs last period</span>
      </div>
    </div>
  )
}

function RevenueChart() {
  const width = 600
  const height = 220
  const padX = 16
  const padY = 24
  const max = Math.max(...CHART_POINTS)
  const points = CHART_POINTS.map((v, i) => {
    const x = padX + (i / (CHART_POINTS.length - 1)) * (width - padX * 2)
    const y = height - padY - (v / max) * (height - padY * 2)
    return [x, y] as const
  })
  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ")
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height - padY} L${points[0][0]},${height - padY} Z`

  const gridLines = [0.25, 0.5, 0.75].map((p) => height - padY - p * (height - padY * 2))

  return (
    <div className="rounded-xl border border-foreground/10 bg-background/60 p-4">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-sm font-semibold">Revenue</p>
        <p className="text-xs text-foreground/55">Last 30 days</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines.map((y) => (
          <line
            key={y}
            x1={padX}
            y1={y}
            x2={width - padX}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.06"
          />
        ))}
        <path d={areaPath} fill="url(#revFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="4"
          fill="var(--primary)"
        />
      </svg>
    </div>
  )
}

function TopEventsList() {
  return (
    <div className="rounded-xl border border-foreground/10 bg-background/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">Top events</p>
        <span className="text-xs text-foreground/55">by revenue</span>
      </div>
      <ul className="flex flex-col gap-3">
        {TOP_EVENTS.map((event) => (
          <li key={event.title} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium">
                {event.title}
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {event.revenue}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${event.share}%` }}
              />
            </div>
            <p className="text-[11px] text-foreground/55">
              {event.tickets.toLocaleString()} tickets &middot;{" "}
              {event.share.toFixed(0)}% of revenue
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
