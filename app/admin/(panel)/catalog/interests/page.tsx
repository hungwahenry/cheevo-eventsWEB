import { InterestsManager } from "@/features/admin/interests/components/interests-manager"

export default function AdminInterestsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interests</h1>
        <p className="text-muted-foreground text-sm">
          Tags attendees pick during onboarding and events are tagged with.
        </p>
      </div>
      <InterestsManager />
    </div>
  )
}
