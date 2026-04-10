"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type User = { id: string; name: string; email: string; plan: string };

function SettingsContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      setUser(d.user);
      setLoading(false);
    });
  }, []);

  async function handleUpgrade() {
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to start checkout. Make sure Stripe is configured.");
      setUpgrading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and billing</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          You&apos;re now on the Pro plan! Enjoy unlimited invoices.
        </div>
      )}
      {canceled && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
          Checkout was canceled. You can upgrade anytime.
        </div>
      )}

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{user?.name}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Billing & Plan</h2>

        {user?.plan === "pro" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg">✓</div>
              <div>
                <div className="font-semibold text-gray-900">Pro Plan — Active</div>
                <div className="text-sm text-gray-500">$9/month · Unlimited invoices · All features</div>
              </div>
              <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">PRO</span>
            </div>
            <p className="text-sm text-gray-500">
              To cancel your subscription, please contact support.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg">●</div>
              <div>
                <div className="font-semibold text-gray-900">Free Plan</div>
                <div className="text-sm text-gray-500">3 invoices per month</div>
              </div>
            </div>

            {/* Upgrade card */}
            <div className="border-2 border-indigo-200 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-lg text-gray-900">Upgrade to Pro</div>
                  <div className="text-3xl font-bold text-indigo-600 mt-1">$9<span className="text-base font-normal text-gray-500">/month</span></div>
                </div>
                <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">MOST POPULAR</span>
              </div>
              <ul className="space-y-2 mb-6">
                {[
                  "Unlimited invoices",
                  "Revenue analytics",
                  "Custom notes on invoices",
                  "Priority support",
                  "Cancel anytime",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {upgrading ? "Redirecting to Stripe..." : "Upgrade to Pro →"}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">Powered by Stripe · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
