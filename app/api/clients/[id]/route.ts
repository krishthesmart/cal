import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, email, phone, address, company } = await req.json();

  const client = await prisma.client.findFirst({ where: { id, userId } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const updated = await prisma.client.update({
    where: { id },
    data: { name, email, phone, address, company },
  });

  return NextResponse.json({ client: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = await prisma.client.findFirst({ where: { id, userId } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
