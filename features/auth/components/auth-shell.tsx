export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <span className="text-2xl font-semibold tracking-tight">cheevo</span>
        </div>
        {children}
      </div>
    </main>
  )
}
