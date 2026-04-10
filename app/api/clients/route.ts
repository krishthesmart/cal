import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { userId },
    include: { _count: { select: { invoices: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, phone, address, company } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: { name, email, phone, address, company, userId },
  });

  return NextResponse.json({ client }, { status: 201 });
}
