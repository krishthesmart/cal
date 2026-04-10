import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUS_COLORS, calculateInvoiceTotal } from "@/lib/utils";
import InvoiceActions from "./InvoiceActions";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const payload = verifyToken(token);
  if (!payload) redirect("/login");

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: payload.userId },
    include: {
      client: true,
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!invoice) notFound();

  const total = calculateInvoiceTotal(invoice.items);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.number}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[invoice.status]}`}>
                {invoice.status}
              </span>
              <span className="text-sm text-gray-500">Due {formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
        <InvoiceActions invoiceId={invoice.id} currentStatus={invoice.status} />
      </div>

      {/* Printable Invoice */}
      <div id="invoice-print" className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-8 print:shadow-none print:border-0">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">FreelanceFlow</span>
            </div>
            <p className="text-gray-700 font-semibold">{invoice.user.name}</p>
            <p className="text-gray-500 text-sm">{invoice.user.email}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">INVOICE</div>
            <div className="text-gray-700 font-semibold mt-1">{invoice.number}</div>
          </div>
        </div>

        {/* Bill To + Dates */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</div>
            <div className="text-gray-900 font-semibold">{invoice.client.name}</div>
            {invoice.client.company && <div className="text-gray-600 text-sm">{invoice.client.company}</div>}
            <div className="text-gray-600 text-sm">{invoice.client.email}</div>
            {invoice.client.phone && <div className="text-gray-600 text-sm">{invoice.client.phone}</div>}
            {invoice.client.address && <div className="text-gray-600 text-sm mt-1 whitespace-pre-line">{invoice.client.address}</div>}
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Issue Date</div>
                <div className="text-gray-700">{formatDate(invoice.issueDate)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Due Date</div>
                <div className="text-gray-700 font-semibold">{formatDate(invoice.dueDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-3 text-gray-800">{item.description}</td>
                  <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                  <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <div className="w-48 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</div>
            <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
          Thank you for your business!
        </div>
      </div>
    </div>
  );
}
