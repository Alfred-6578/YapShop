import { NextResponse, type NextRequest } from "next/server"

/**
 * Server-side route guard. Runs at the edge BEFORE pages render, so
 * unauthenticated users never get the dashboard tree (or its queries) on
 * their machine — they're bounced to /?next=<encoded path> instead.
 *
 * Replaces the old client-side AuthGuard, which only ran post-mount and
 * still let pages flash + fire queries before redirecting.
 *
 * Auth signal: the `yapshop_authed` cookie set by lib/api/tokens.ts when
 * tokens are stored. Cookie carries no value beyond presence (the actual
 * Bearer token stays in localStorage where the API client reads it). This
 * is a "do you have a session at all?" check, not a "is your token still
 * valid?" check — the API client's refresh-on-401 path handles the latter.
 */

const PROTECTED_PREFIXES = [
  "/orders",
  "/conversations",
  "/handoffs",
  "/customers",
  "/products",
  "/staff",
  "/settings",
  "/dashboard",
]

const AUTH_FLAG_COOKIE = "yapshop_authed"

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  if (req.cookies.get(AUTH_FLAG_COOKIE)?.value === "1") {
    return NextResponse.next()
  }

  // Preserve the original path + query so the login flow can route the
  // user back to where they were trying to go.
  const url = req.nextUrl.clone()
  url.pathname = "/"
  url.search = ""
  url.searchParams.set("next", pathname + search)
  return NextResponse.redirect(url)
}

export const config = {
  // Skip Next.js internals and static asset extensions. The matcher controls
  // which requests middleware even RUNS for — cheaper than entering the
  // function and checking pathname. Extend the extension list if you start
  // serving other static types.
  matcher: [
    "/((?!_next/|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|js|css|map)$).*)",
  ],
}
