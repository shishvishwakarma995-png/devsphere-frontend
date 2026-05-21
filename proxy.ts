import { NextRequest, NextResponse } from 'next/server'

const AUTH_ROUTES = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Auth pages: if already logged in → go to /home
  if (AUTH_ROUTES.includes(pathname)) {
    if (token) return NextResponse.redirect(new URL('/home', request.url))
    return NextResponse.next()
  }

  // Landing page: not logged in → show landing, logged in → /home
  if (pathname === '/') {
    if (token) return NextResponse.redirect(new URL('/home', request.url))
    return NextResponse.next()
  }

  // Protected routes: no token → /login
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', '/login', '/register',
    '/home/:path*', '/create/:path*',
    '/settings/:path*', '/u/:path*',
    '/communities/:path*', '/trending',
    '/following', '/saved',
    '/post/:path*', '/tag/:path*',
    '/c/:path*',
  ]
}