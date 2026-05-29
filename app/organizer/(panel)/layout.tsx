import { SignOutButton } from "@/features/organizer/components/sign-out-button"

export default function OrganizerPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="font-semibold tracking-tight">cheevo</span>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
