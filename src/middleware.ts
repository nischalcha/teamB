import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_USER_ROUTES = ['/dashboard'];
const PROTECTED_ADMIN_ROUTES = ['/admin-portal'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('payload-token')?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isUserRoute = PROTECTED_USER_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = PROTECTED_ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // No token on protected route -> send to login (layout will validate token via getCurrentUser)
  if (!token && (isUserRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token present: let the request through. Layouts will call getCurrentUser() and redirect if invalid.
  // (We avoid fetching /api/users/me here because that often fails in production Edge.)
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin-portal/:path*', '/login', '/register'],
};
