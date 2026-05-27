import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login'];
const AUTH_COOKIE = 'auth';

export function middleware(req: NextRequest) {
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
