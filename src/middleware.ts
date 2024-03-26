import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "./lib/auth";

export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  
}

export const config = { matcher: ['/dashboard/:path*', '/api/:function*'] }