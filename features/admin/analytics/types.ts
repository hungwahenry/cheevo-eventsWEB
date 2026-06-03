export type AnalyticsOverview = {
  users: {
    total: number
    new_30d: number
    suspended: number
    organisers: number
  }
  organisations: {
    total: number
    suspended: number
    with_payout_account: number
  }
  events: {
    total: number
    published: number
    past: number
  }
  orders: {
    total: number
    paid: number
    refunded: number
    pending: number
  }
  gmv: {
    currency: string
    total_minor: number
    last_30d_minor: number
  }
  action_items: {
    open_reports: number
    pending_payouts: number
    failed_payouts: number
    failed_jobs: number
  }
}

export type AnalyticsInterval = "day" | "week" | "month"

export type RevenueSeries = {
  interval: AnalyticsInterval
  currency: string
  series: { bucket: string; gmv_minor: number; orders: number }[]
}

export type PaymentsAnalytics = {
  by_provider: Record<
    string,
    {
      successful: number
      failed: number
      total: number
      success_rate: number
    }
  >
  totals: {
    successful: number
    failed: number
    total: number
    success_rate: number
  }
}

export type EngagementSeries = {
  interval: string
  series: {
    bucket: string
    comments: number
    rsvps: number
    subscriptions: number
  }[]
}
