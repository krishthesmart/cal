"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user?: { name: string; plan: string } }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">FreelanceFlow</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.plan === "pro" && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">PRO</span>
              )}
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
