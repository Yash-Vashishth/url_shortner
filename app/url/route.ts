import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { PrismaClient } from "@/app/generated/prisma";


const prisma = new PrismaClient()

export const runtime = "nodejs"; // 👈 important

export async function GET() {
    try {
        const urls = await prisma.url.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            urls: urls,
            message: "URLs fetched successfully",
        });
    }
    catch (error) {
        return NextResponse.json(
            { error: "Failed to feth URLs" },
            { status: 500 }
        );
    }    
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            )
        }

        const slug = nanoid(10);
        const newUrl = await prisma.url.create({
            data: {
                url,
                slug
            }
        });
        return NextResponse.json({
            url: newUrl.url,
            slug: newUrl.slug,
            message: "URL created successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create URL" },
            { status: 500 }
        )
    }
    
}