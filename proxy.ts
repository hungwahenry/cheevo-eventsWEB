import { SESSION_COOKIE } from "@/lib/constants"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login"]

// Optimistic route guard: redirect to /login when the session cookie is absent.
// Real authorization is enforced by Laravel on each proxied API call.
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const hasSession = request.cookies.has(SESSION_COOKIE)

  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (hasSession && isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on page routes only — skip API (handles its own auth), static assets, and files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
}
