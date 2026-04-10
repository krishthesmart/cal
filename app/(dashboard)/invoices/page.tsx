"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, STATUS_COLORS, calculateInvoiceTotal } from "@/lib/utils";

type Invoice = {
  id: string;
  number: string;
  status: string;
  dueDate: string;
  issueDate: string;
  client: { name: string; email: string };
  items: { quantity: number; rate: number }[];
};

const statusOptions = ["all", "draft", "sent", "paid", "overdue"];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchInvoices = useCallback(async () => {
    const res = await fetch("/api/invoices");
    const data = await res.json();
    setInvoices(data.invoices || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchInvoices();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice?")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    fetchInvoices();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">{filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === "all" ? "No invoices yet" : `No ${filter} invoices`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === "all" ? "Create your first invoice to get paid" : `No invoices with status "${filter}"`}
          </p>
          {filter === "all" && (
            <Link
              href="/dashboard/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Invoice
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left">Invoice #</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Issue Date</th>
                <th className="px-6 py-3 text-left">Due Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inv.client.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(calculateInvoiceTotal(inv.items))}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize border-0 cursor-pointer ${STATUS_COLORS[inv.status]}`}
                    >
                      {["draft", "sent", "paid", "overdue"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/dashboard/invoices/${inv.id}`} className="text-sm text-indigo-600 hover:underline">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
