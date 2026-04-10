"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoiceActions({ invoiceId, currentStatus }: { invoiceId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch(`/api/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex items-center gap-3 print:hidden">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print / PDF
      </button>

      {currentStatus === "draft" && (
        <button
          onClick={() => updateStatus("sent")}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Mark as Sent
        </button>
      )}

      {(currentStatus === "sent" || currentStatus === "overdue") && (
        <button
          onClick={() => updateStatus("paid")}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Mark as Paid
        </button>
      )}

      {currentStatus === "sent" && (
        <button
          onClick={() => updateStatus("overdue")}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          Mark Overdue
        </button>
      )}
    </div>
  );
}
