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
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const query = searchParams.get("q");

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        ...(status && status !== "ALL" ? { status } : {}),
        ...(clientId ? { clientId } : {}),
        ...(query
          ? {
              OR: [
                { invoiceNumber: { contains: query } },
                { client: { name: { contains: query } } },
                { client: { company: { contains: query } } },
              ],
            }
          : {}),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute metrics
    let totalRevenue = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;

    for (const inv of invoices) {
      if (inv.status === "PAID") {
        totalRevenue += inv.totalAmount;
      } else if (inv.status === "SENT") {
        pendingAmount += inv.totalAmount;
      } else if (inv.status === "OVERDUE") {
        overdueAmount += inv.totalAmount;
      }
    }

    return NextResponse.json({
      invoices,
      metrics: {
        totalRevenue,
        pendingAmount,
        overdueAmount,
        totalInvoices: invoices.length,
      },
    });
  } catch (error: any) {
    console.error("Invoices GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const {
      clientId,
      issueDate,
      dueDate,
      taxRate = 0,
      discount = 0,
      notes,
      terms,
      items = [],
      status = "DRAFT",
    } = data;

    if (!clientId) {
      return NextResponse.json(
        { error: "Client selection is required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one invoice item is required" },
        { status: 400 }
      );
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Invalid client" }, { status: 404 });
    }

    // Generate next invoice number
    const count = await prisma.invoice.count({
      where: { userId: user.id },
    });
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, "0")}`;

    // Calculate totals
    let subtotal = 0;
    const computedItems = items.map((item: any) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const amount = quantity * unitPrice;
      subtotal += amount;
      return {
        description: item.description || "Service",
        quantity,
        unitPrice,
        amount,
      };
    });

    const parsedTaxRate = Number(taxRate) || 0;
    const parsedDiscount = Number(discount) || 0;

    const discountAmount = (subtotal * parsedDiscount) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * parsedTaxRate) / 100;
    const totalAmount = subtotalAfterDiscount + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: user.id,
        clientId,
        status,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        currency: user.currency || "USD",
        taxRate: parsedTaxRate,
        discount: parsedDiscount,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        notes,
        terms: terms || "Payment due within 14 days of issue.",
        items: {
          create: computedItems,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("Invoices POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
