// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const protectedRoutes = ["/admin", "/staff"];

// export function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("token")?.value;

//   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/staff/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // token exists but role missing
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/staff", req.url));
  }

  if (pathname.startsWith("/staff") && role !== "staff") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
