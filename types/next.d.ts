// types/next.d.ts
import type { NextRequest } from "next/server";

declare module "next/server" {
  // Correct typing for dynamic route handlers
  export interface RouteHandlerContext<P = Record<string, string>> {
    params: P;
  }
}
