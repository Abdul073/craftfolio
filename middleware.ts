import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)'])

const customMiddleware = clerkMiddleware(async (auth, req) => {
  const hostname = req.headers.get('host') || ''
  const domain = 'jupiters.in'
  console.log('Middleware received request with hostname:', hostname)

  // Fix subdomain extraction logic
  let subdomain = null;
  
  // Check if the hostname contains the domain
  if (hostname.includes(domain)) {
    // Remove the domain part (and the dot before it)
    const parts = hostname.split('.');
    
    // In a subdomain like abc.jupiters.in, parts would be ['abc', 'jupiters', 'in']
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  }
  
  console.log('Extracted subdomain:', subdomain);

  // Optional: prevent routing changes for root domain
  const isRootDomain = hostname === domain || hostname === `www.${domain}`
  if (!isRootDomain && subdomain) {
    // Rewrite all subdomain routes to a dynamic path
    const url = req.nextUrl
    const newPath = `/_sites/${subdomain}${url.pathname}`
    console.log('Rewriting path to:', newPath)
    url.pathname = newPath
    return NextResponse.rewrite(url)
  }

  // Apply Clerk auth to protected routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  return NextResponse.next()
})

export default customMiddleware

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}