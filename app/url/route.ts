import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { PrismaClient } from "@/app/generated/prisma";


const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { url } = body;

    const slug = nanoid(5);

    const newUrl = await prisma.url.create({
        data: {
            url,
            slug
        }
    })

    return NextResponse.json({
        url: newUrl.url,
        slug: newUrl.slug,
        message: "URL created successfully",
    });
}