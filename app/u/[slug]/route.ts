import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: any) {
  // Context.params is always { slug: string } at runtime
  const { slug } = (await context.params) || {}; // works whether Vercel thinks it's a Promise or not

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const url = await prisma.url.findUnique({
    where: { slug },
  });

  if (!url) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  return NextResponse.redirect(url.url, { status: 302 });
}
