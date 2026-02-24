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

  if (!token && (isUserRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (isUserRoute || isAdminRoute)) {
    try {
      const meResponse = await fetch(`${request.nextUrl.origin}/api/users/me`, {
        headers: { Authorization: `JWT ${token}` },
      });

      if (!meResponse.ok) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('payload-token');
        return response;
      }

      const { user } = await meResponse.json();

      if (!user) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('payload-token');
        return response;
      }

      const role = user.role as string;

      if (isAdminRoute && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (isUserRoute && role === 'admin') {
        return NextResponse.redirect(new URL('/admin-portal', request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('payload-token');
      return response;
    }
  }

  if (token && isAuthRoute) {
    try {
      const meResponse = await fetch(`${request.nextUrl.origin}/api/users/me`, {
        headers: { Authorization: `JWT ${token}` },
      });

      if (meResponse.ok) {
        const { user } = await meResponse.json();
        if (user) {
          const role = user.role as string;
          return NextResponse.redirect(
            new URL(role === 'admin' ? '/admin-portal' : '/dashboard', request.url),
          );
        }
      }
    } catch {
      // Token invalid, let them access auth routes
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin-portal/:path*', '/login', '/register'],
};
