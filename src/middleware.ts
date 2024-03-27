import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "./lib/auth";

export { default } from "next-auth/middleware"

export const config = { matcher: ['/dashboard/:path*'] }