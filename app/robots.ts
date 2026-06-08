import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/organizer", "/admin", "/login", "/dashboard", "/api"],
    },
    sitemap: "https://cheevo.vip/sitemap.xml",
    host: "https://cheevo.vip",
  }
}
