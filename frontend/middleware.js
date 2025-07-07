import { NextResponse } from 'next/server';

const protectedRoutes = ['/profile', '/cart', '/wishlist'];

const authRoutes = ['/login', '/register'];

const publicRoutes = ['/', '/books', '/about'];

const adminRoutes = ['/admin'];

const managerRoutes = ['/manager'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  console.log(`Middleware: path=${pathname}, token=${!!token}, role=${role}`);

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isManagerRoute = managerRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('role');
      return response;
    }
  }

  if (isAuthRoute && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'MANAGER') {
      return NextResponse.redirect(new URL('/manager', request.url));
    } else {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  if (isAdminRoute) {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (isManagerRoute) {
    if (!token || role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};