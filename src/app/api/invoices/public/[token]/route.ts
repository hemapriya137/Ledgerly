import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ viewToken: params.token }, { id: params.token }],
      },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            companyName: true,
            companyEmail: true,
            companyAddress: true,
            companyPhone: true,
            companyLogo: true,
            taxNumber: true,
            isPro: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found or expired" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ viewToken: params.token }, { id: params.token }],
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ message: "Invoice is already paid", invoice });
    }

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment received successfully!",
      invoice: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
