import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { generateInvoiceNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const invoices = await prisma.invoice.findMany({
    where: { userId, ...(status ? { status } : {}) },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Free plan: limit to 3 invoices per month
  if (user.plan === "free") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyCount = await prisma.invoice.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });

    if (monthlyCount >= 3) {
      return NextResponse.json(
        { error: "Free plan limit reached. Upgrade to Pro for unlimited invoices.", code: "LIMIT_REACHED" },
        { status: 403 }
      );
    }
  }

  const { clientId, dueDate, notes, items } = await req.json();

  if (!clientId || !dueDate || !items?.length) {
    return NextResponse.json({ error: "Client, due date, and items are required" }, { status: 400 });
  }

  const totalInvoices = await prisma.invoice.count({ where: { userId } });
  const invoiceNumber = generateInvoiceNumber(totalInvoices);

  const invoice = await prisma.invoice.create({
    data: {
      number: invoiceNumber,
      dueDate: new Date(dueDate),
      notes,
      userId,
      clientId,
      items: {
        create: items.map((item: { description: string; quantity: number; rate: number }) => ({
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
        })),
      },
    },
    include: { client: true, items: true },
  });

  return NextResponse.json({ invoice }, { status: 201 });
}
