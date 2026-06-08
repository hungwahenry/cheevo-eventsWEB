import Image from "next/image"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Image
            src="/images/logo.png"
            alt="cheevo organizers"
            width={1024}
            height={300}
            priority
            className="h-10 w-auto"
          />
        </div>
        {children}
      </div>
    </main>
  )
}
