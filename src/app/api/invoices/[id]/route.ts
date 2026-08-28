import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            id: true,
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
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const data = await req.json();
    const {
      clientId,
      issueDate,
      dueDate,
      taxRate = existing.taxRate,
      discount = existing.discount,
      notes,
      terms,
      items = [],
      status = existing.status,
    } = data;

    // Recalculate totals if items provided
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

    // Delete previous items and insert new ones
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        clientId: clientId || existing.clientId,
        issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
        dueDate: dueDate ? new Date(dueDate) : existing.dueDate,
        taxRate: parsedTaxRate,
        discount: parsedDiscount,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        notes: notes !== undefined ? notes : existing.notes,
        terms: terms !== undefined ? terms : existing.terms,
        status,
        items: {
          create: computedItems,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
