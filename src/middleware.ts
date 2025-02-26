import { NextResponse } from "next/server";

export function middleware(request: Request) {
  return NextResponse.redirect(new URL("/events/all", request.url));
}

export const config = {
  matcher: ["/events"],
};

