"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Client = { id: string; name: string; email: string; company?: string };
type Item = { description: string; quantity: string; rate: string };

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: "1", rate: "" }]);

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then((d) => setClients(d.clients || []));
  }, []);

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: "1", rate: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof Item, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  const total = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      clientId: formData.get("clientId"),
      dueDate: formData.get("dueDate"),
      notes: formData.get("notes") || undefined,
      items: items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
      })),
    };

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create invoice");
      return;
    }

    router.push(`/dashboard/invoices/${data.invoice.id}`);
  }

  const today = new Date().toISOString().split("T")[0];
  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
          <p className="text-gray-500 text-sm">Fill in the details below</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
          {error.includes("upgrade") && (
            <Link href="/dashboard/settings" className="ml-2 font-semibold underline">
              Upgrade to Pro →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
              <select
                name="clientId"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` (${c.company})` : ""}
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  <Link href="/dashboard/clients" className="text-indigo-600 underline">Add a client first</Link>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                name="dueDate"
                type="date"
                required
                defaultValue={thirtyDays}
                min={today}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Payment terms, thank you note, etc."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Line Items</h2>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-6">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>}
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    required
                    placeholder="Service or product description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>}
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Rate ($)</label>}
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(index, "rate", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                  />
                </div>
                <div className="col-span-1">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Total</label>}
                  <div className="py-2 text-sm text-gray-700 font-medium">
                    {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0))}
                  </div>
                </div>
                <div className="col-span-1 flex items-end pb-1">
                  {index === 0 && <div className="h-5 mb-1" />}
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Line Item
          </button>

          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link
            href="/dashboard/invoices"
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || clients.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
