import { serverConfig } from "@/lib/server/config"
import { clearSessionCookie, getSessionToken } from "@/lib/server/session"
import { NextResponse } from "next/server"

export async function POST(): Promise<Response> {
  const token = await getSessionToken()

  if (token) {
    await fetch(`${serverConfig.apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => {})
  }

  const response = NextResponse.json({
    status: "success",
    message: "Logged out.",
    data: null,
  })
  clearSessionCookie(response)
  return response
}
