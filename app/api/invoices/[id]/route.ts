import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
    include: { client: true, items: true, user: { select: { name: true, email: true } } },
  });

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json({ invoice });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const data = await req.json();
  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: data.status },
    include: { client: true, items: true },
  });

  return NextResponse.json({ invoice: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
