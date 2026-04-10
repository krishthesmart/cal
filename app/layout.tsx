import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreelanceFlow — Invoice & Client Management for Freelancers",
  description:
    "Create professional invoices, manage clients, and get paid faster. The all-in-one invoicing tool built for freelancers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
