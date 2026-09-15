import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Pre-launch lock check
  const isLocked = process.env.PRELAUNCH_LOCKED === 'true';
  const isPublicPath =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/coming-soon';

  if (isLocked && !isPublicPath) {
    const bypassCookie = request.cookies.get('arovaq_prelaunch_bypass');
    if (bypassCookie?.value !== process.env.PRELAUNCH_SECRET) {
      return NextResponse.redirect(new URL('/coming-soon', request.url));
    }
  }

  // 2. Your existing middleware logic (e.g., Supabase session refresh) goes here...
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};