import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const customMiddleware = async (req: NextRequest) => {
  return NextResponse.next()
}

export default customMiddleware

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}