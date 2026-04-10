import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [invoices, clients] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      include: { items: true },
    }),
    prisma.client.count({ where: { userId } }),
  ]);

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.items.reduce((s, item) => s + item.quantity * item.rate, 0), 0);

  const outstandingRevenue = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.items.reduce((s, item) => s + item.quantity * item.rate, 0), 0);

  const statusCounts = {
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  // Monthly revenue for the past 6 months
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const revenue = invoices
      .filter((inv) => {
        const date = new Date(inv.issueDate);
        return inv.status === "paid" && date >= start && date <= end;
      })
      .reduce((sum, inv) => sum + inv.items.reduce((s, item) => s + item.quantity * item.rate, 0), 0);

    return {
      month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      revenue,
    };
  }).reverse();

  return NextResponse.json({
    totalRevenue,
    outstandingRevenue,
    totalInvoices: invoices.length,
    totalClients: clients,
    statusCounts,
    monthlyRevenue,
  });
}
