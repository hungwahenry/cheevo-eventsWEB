import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {}

export default withSentryConfig(nextConfig, {
  org: "issorite",
  project: "cheevo-web",
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Route Sentry events through our own domain so ad-blockers don't drop them.
  // Avoid names like "monitoring"/"analytics" — those are on ad-blocker filter lists.
  tunnelRoute: "/relay",
  disableLogger: true,
  automaticVercelMonitors: true,
})
