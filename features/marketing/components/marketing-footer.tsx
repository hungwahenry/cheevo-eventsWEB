import Image from "next/image"
import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t border-foreground/10 px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <Link href="/" aria-label="cheevo organizers" className="inline-flex">
            <Image
              src="/images/logo.png"
              alt="cheevo organizers"
              width={1024}
              height={256}
              className="h-7 w-auto"
            />
          </Link>
          <span className="text-xs text-foreground/55">
            © {new Date().getFullYear()} cheevo. Built for organisers.
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/65">
          <Link
            href="https://cheevo.events"
            className="transition-colors hover:text-foreground"
          >
            For attendees
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Get started
          </Link>
        </nav>
      </div>
    </footer>
  )
}
