import { WelcomeEditor } from "@/features/admin/welcome/components/welcome-editor"

export default function AdminWelcomePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome screen</h1>
        <p className="text-muted-foreground text-sm">
          What every new user sees before signing in.
        </p>
      </div>
      <WelcomeEditor />
    </div>
  )
}
