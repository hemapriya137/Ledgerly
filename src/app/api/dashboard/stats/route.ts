import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [invoices, expenses, clients] = await Promise.all([
      prisma.invoice.findMany({
        where: { userId: user.id },
        include: {
          client: {
            select: { id: true, name: true, company: true, email: true },
          },
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.expense.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
      }),
      prisma.client.findMany({
        where: { userId: user.id },
        select: { id: true },
      }),
    ]);

    // Financial summaries
    let totalPaidRevenue = 0;
    let pendingReceivables = 0;
    let overdueReceivables = 0;
    let draftAmount = 0;

    for (const inv of invoices) {
      if (inv.status === "PAID") {
        totalPaidRevenue += inv.totalAmount;
      } else if (inv.status === "SENT") {
        pendingReceivables += inv.totalAmount;
      } else if (inv.status === "OVERDUE") {
        overdueReceivables += inv.totalAmount;
      } else if (inv.status === "DRAFT") {
        draftAmount += inv.totalAmount;
      }
    }

    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};

    for (const exp of expenses) {
      totalExpenses += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    }

    const netProfit = totalPaidRevenue - totalExpenses;
    const profitMargin = totalPaidRevenue > 0 ? ((netProfit / totalPaidRevenue) * 100).toFixed(1) : "0.0";

    // 6-Month Timeline aggregation for Income vs Expenses
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyDataMap: Record<string, { month: string; income: number; expenses: number; net: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyDataMap[key] = { month: key, income: 0, expenses: 0, net: 0 };
    }

    // Populate invoice revenues
    for (const inv of invoices) {
      const invDate = inv.paidAt || inv.issueDate;
      const key = `${monthNames[invDate.getMonth()]} ${invDate.getFullYear().toString().slice(-2)}`;
      if (monthlyDataMap[key]) {
        if (inv.status === "PAID") {
          monthlyDataMap[key].income += inv.totalAmount;
        }
      }
    }

    // Populate expenses
    for (const exp of expenses) {
      const expDate = new Date(exp.date);
      const key = `${monthNames[expDate.getMonth()]} ${expDate.getFullYear().toString().slice(-2)}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].expenses += exp.amount;
      }
    }

    // Compute net for each month
    const timeline = Object.values(monthlyDataMap).map((m) => ({
      ...m,
      income: Math.round(m.income),
      expenses: Math.round(m.expenses),
      net: Math.round(m.income - m.expenses),
    }));

    // Format Expense Categories for Pie/Donut Chart
    const categoryColors: Record<string, string> = {
      Software: "#06b6d4",
      Hardware: "#6366f1",
      Travel: "#f59e0b",
      Contractor: "#10b981",
      Marketing: "#a855f7",
      Office: "#f43f5e",
      General: "#94a3b8",
    };

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: categoryColors[name] || "#10b981",
    }));

    return NextResponse.json({
      metrics: {
        totalPaidRevenue,
        pendingReceivables,
        overdueReceivables,
        draftAmount,
        totalExpenses,
        netProfit,
        profitMargin,
        clientCount: clients.length,
        clientLimit: user.isPro ? Infinity : 5,
        isPro: user.isPro,
      },
      timeline,
      categoryBreakdown,
      recentInvoices: invoices.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        isPro: user.isPro,
        currency: user.currency,
      },
    });
  } catch (error: any) {
    console.error("Dashboard Stats GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
