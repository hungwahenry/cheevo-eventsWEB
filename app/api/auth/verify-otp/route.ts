import { serverConfig } from "@/lib/server/config"
import { setSessionCookie } from "@/lib/server/session"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<Response> {
  const laravelResponse = await fetch(
    `${serverConfig.apiBaseUrl}/auth/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: await request.text(),
      cache: "no-store",
    }
  )

  const payload = await laravelResponse.json()

  if (!laravelResponse.ok) {
    return NextResponse.json(payload, { status: laravelResponse.status })
  }

  const token: string | undefined = payload?.data?.token
  const response = NextResponse.json({
    status: "success",
    message: payload.message ?? "Signed in.",
    data: { user: payload?.data?.user ?? null },
  })

  if (token) setSessionCookie(response, token)
  return response
}
