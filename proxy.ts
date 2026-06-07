import { SESSION_COOKIE } from "@/lib/constants"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/"]
const GUEST_ONLY_ROUTES = ["/login"]

const matches = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE)

  if (matches(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next()
  }

  if (matches(pathname, GUEST_ONLY_ROUTES)) {
    if (hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|relay|_next/static|_next/image|favicon.ico|.*\\.).*)"],
}
