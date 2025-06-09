import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const url = req.nextUrl.clone()

  const isDev = host.includes('localhost')

  let subdomain = ''

  if (isDev) {
    const hostWithoutPort = host.split(':')[0]
    if (hostWithoutPort.endsWith('.localhost')) {
      subdomain = hostWithoutPort.replace('.localhost', '')
    }
  } else {
    subdomain = host.split('.')[0]
  }

  const isSystemPath =
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/.well-known')

  if (!isSystemPath && subdomain && subdomain !== 'www' && subdomain !== 'craftfolio') {
    url.pathname = `/portfolio-sites/${subdomain}` // rewrite to portfolio root page
    console.log('[Middleware] Rewriting:', {
      original: req.nextUrl.pathname,
      newPath: url.pathname,
      subdomain,
      host,
      isDev,
    })
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export default middleware

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
