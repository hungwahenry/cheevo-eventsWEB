import { PlatformsManager } from "@/features/admin/social-platforms/components/platforms-manager"

export default function AdminSocialPlatformsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Social platforms
        </h1>
        <p className="text-muted-foreground text-sm">
          Platforms orgs can link from their profile (Instagram, TikTok, etc.).
        </p>
      </div>
      <PlatformsManager />
    </div>
  )
}
