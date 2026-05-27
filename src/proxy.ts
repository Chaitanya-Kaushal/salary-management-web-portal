import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login'];
const AUTH_COOKIE = 'auth';
const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'true';

export function proxy(req: NextRequest) {
  if (MOCKING_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get(AUTH_COOKIE);
  if (!authCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
