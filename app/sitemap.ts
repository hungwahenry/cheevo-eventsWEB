import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://cheevo.vip", changeFrequency: "monthly", priority: 1 },
  ]
}
