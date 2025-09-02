import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params; // ✅ works with Vercel’s type expectation

  const url = await prisma.url.findUnique({
    where: { slug },
  });

  if (!url) {
    return NextResponse.json({ error: "URL not found" }, { status: 400 });
  }

  return NextResponse.redirect(url.url, { status: 302 });
}
