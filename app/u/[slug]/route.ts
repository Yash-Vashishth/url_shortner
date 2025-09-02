import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs"; // ✅ ensure Node runtime

export async function GET(request: NextRequest, context: any) {
  const { slug } = (await context.params) || {};

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
