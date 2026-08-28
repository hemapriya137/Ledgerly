import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const clients = await prisma.client.findMany({
      where: {
        userId: user.id,
        OR: query
          ? [
              { name: { contains: query } },
              { email: { contains: query } },
              { company: { contains: query } },
            ]
          : undefined,
      },
      include: {
        invoices: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const clientCount = await prisma.client.count({
      where: { userId: user.id },
    });

    const isLimitReached = !user.isPro && clientCount >= 5;

    return NextResponse.json({
      clients,
      count: clientCount,
      isPro: user.isPro,
      limit: user.isPro ? Infinity : 5,
      isLimitReached,
    });
  } catch (error: any) {
    console.error("Clients GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Free Tier client limit check: 5 clients max
    const clientCount = await prisma.client.count({
      where: { userId: user.id },
    });

    if (!user.isPro && clientCount >= 5) {
      return NextResponse.json(
        {
          error: "Free tier client limit reached (max 5 clients). Upgrade to Pro for unlimited clients!",
          code: "LIMIT_REACHED",
        },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { name, email, company, phone, address, notes } = data;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Client name and email are required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    console.error("Clients POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
