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
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        ...(category && category !== "ALL" ? { category } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { clientName: { contains: query } },
              ],
            }
          : {}),
      },
      orderBy: { date: "desc" },
    });

    // Aggregate category totals
    const categoryTotals: Record<string, number> = {};
    let totalExpenses = 0;

    for (const exp of expenses) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      totalExpenses += exp.amount;
    }

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));

    return NextResponse.json({
      expenses,
      totalExpenses,
      categoryBreakdown,
      count: expenses.length,
    });
  } catch (error: any) {
    console.error("Expenses GET error:", error);
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
    const { title, description, amount, category = "General", date, receiptUrl, isBillable = false, clientName } = data;

    if (!title || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Title and amount are required" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return NextResponse.json(
        { error: "Please enter a valid positive expense amount" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        amount: parsedAmount,
        category,
        date: date ? new Date(date) : new Date(),
        receiptUrl: receiptUrl || null,
        isBillable: Boolean(isBillable),
        clientName: clientName?.trim() || null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error("Expenses POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
