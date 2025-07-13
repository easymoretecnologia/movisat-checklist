import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Get the pathname
    const { pathname } = req.nextUrl

    // Allow access to login page for unauthenticated users
    if (pathname.startsWith('/login')) {
      return NextResponse.next()
    }

    // If user is authenticated and trying to access login, redirect to dashboard
    if (pathname.startsWith('/login') && req.nextauth.token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard') || pathname === '/') {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow access to login page
        if (pathname.startsWith('/login')) {
          return true
        }

        // For protected routes, require authentication
        if (pathname.startsWith('/dashboard') || pathname === '/') {
          return !!token
        }

        // Allow access to other pages (public pages, API routes, etc.)
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
}