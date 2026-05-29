import { serverConfig } from "@/lib/server/config"
import { getSessionToken } from "@/lib/server/session"
import type { NextRequest } from "next/server"

export async function forwardToLaravel(
  request: NextRequest,
  path: string
): Promise<Response> {
  const target = `${serverConfig.apiBaseUrl}/${path}${request.nextUrl.search}`

  const headers = new Headers({ Accept: "application/json" })
  const contentType = request.headers.get("content-type")
  if (contentType) headers.set("Content-Type", contentType)
  const token = await getSessionToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const hasBody = request.method !== "GET" && request.method !== "HEAD"

  const laravelResponse = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  })

  return new Response(laravelResponse.body, {
    status: laravelResponse.status,
    headers: {
      "Content-Type":
        laravelResponse.headers.get("content-type") ?? "application/json",
    },
  })
}
