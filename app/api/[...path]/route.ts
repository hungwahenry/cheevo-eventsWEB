import { forwardToLaravel } from "@/lib/server/laravel"
import type { NextRequest } from "next/server"

type Context = { params: Promise<{ path: string[] }> }

async function handler(request: NextRequest, ctx: Context): Promise<Response> {
  const { path } = await ctx.params
  return forwardToLaravel(request, path.join("/"))
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
}
