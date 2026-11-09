import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const session = await verifyAdminToken(token);
  if (!session) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    const response = NextResponse.redirect(login);
    response.cookies.delete(ADMIN_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
