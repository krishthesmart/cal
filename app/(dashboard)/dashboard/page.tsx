import { cookies } from "next/headers";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUS_COLORS, calculateInvoiceTotal } from "@/lib/utils";

async function getStats(userId: string) {
  const [invoices, clientCount] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      include: { items: true, client: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.count({ where: { userId } }),
  ]);

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + calculateInvoiceTotal(i.items), 0);

  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + calculateInvoiceTotal(i.items), 0);

  return { invoices, clientCount, totalRevenue, outstanding };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value!;
  const payload = verifyToken(token)!;
  const { invoices, clientCount, totalRevenue, outstanding } = await getStats(payload.userId);

  const recent = invoices.slice(0, 5);

  const stats = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: "💰", color: "text-green-600 bg-green-50" },
    { label: "Outstanding", value: formatCurrency(outstanding), icon: "⏳", color: "text-orange-600 bg-orange-50" },
    { label: "Total Invoices", value: String(invoices.length), icon: "📄", color: "text-blue-600 bg-blue-50" },
    { label: "Total Clients", value: String(clientCount), icon: "👥", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your freelance business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg text-xl mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          <Link href="/dashboard/invoices" className="text-sm text-indigo-600 hover:underline font-medium">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-500 mb-6">Create your first invoice to get started</p>
            <Link
              href="/dashboard/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-3 text-left">Invoice</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Due Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inv.client.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(calculateInvoiceTotal(inv.items))}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(inv.dueDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/invoices/${inv.id}`} className="text-sm text-indigo-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/invoices/new"
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <div>
            <div className="font-semibold text-gray-900">New Invoice</div>
            <div className="text-sm text-gray-500">Create and send an invoice</div>
          </div>
        </Link>
        <Link
          href="/dashboard/clients"
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
          <div>
            <div className="font-semibold text-gray-900">Add Client</div>
            <div className="text-sm text-gray-500">Manage your client contacts</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
