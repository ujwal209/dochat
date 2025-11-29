import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 1. Define routes that should be accessible without logging in
// We must include sign-in and sign-up to avoid a redirect loop
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // 2. If the route is NOT public, enforce authentication
  if (!isPublicRoute(req)) {
    // FIX: Manually check for userId and redirect if missing
    // This avoids the TypeScript error with .protect() in some versions
    const { userId, redirectToSignIn } = await auth()
    if (!userId) {
      return redirectToSignIn()
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}