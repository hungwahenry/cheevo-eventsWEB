import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {}

export default withSentryConfig(nextConfig, {
  org: "issorite",
  project: "cheevo-web",
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Route Sentry events through our own domain so ad-blockers don't drop them.
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
})
