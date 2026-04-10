import Link from "next/link";

const features = [
  {
    icon: "📄",
    title: "Professional Invoices",
    desc: "Create beautiful, branded invoices in seconds. Add your logo, customize colors, and send instantly.",
  },
  {
    icon: "👥",
    title: "Client Management",
    desc: "Keep all client info in one place. Track contacts, history, and outstanding balances effortlessly.",
  },
  {
    icon: "📊",
    title: "Revenue Tracking",
    desc: "See exactly what you've earned and what's outstanding. Get insights to grow your freelance business.",
  },
  {
    icon: "🔔",
    title: "Payment Tracking",
    desc: "Mark invoices as sent, paid, or overdue. Never lose track of a payment again.",
  },
  {
    icon: "🖨️",
    title: "PDF Export",
    desc: "Download or print any invoice as a clean PDF to send to clients or keep for your records.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your financial data stays yours. We use bank-grade encryption to keep everything safe.",
  },
];

const testimonials = [
  {
    quote: "FreelanceFlow cut my invoicing time by 80%. I used to spend hours on billing — now it takes minutes.",
    name: "Alex Carter",
    role: "UI/UX Designer",
  },
  {
    quote: "I finally have a clear picture of what money is coming in. The dashboard is incredibly useful.",
    name: "Maria Gonzalez",
    role: "Freelance Developer",
  },
  {
    quote: "The best $9 I spend every month. It paid for itself the first week with a recovered overdue payment.",
    name: "Sam Williams",
    role: "Content Strategist",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">FreelanceFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 text-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Trusted by 2,000+ freelancers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Invoicing built for{" "}
            <span className="text-indigo-600">freelancers</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create professional invoices, manage your clients, and track payments — all in one place.
            Spend less time on admin and more time on work you love.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-lg"
            >
              See Pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">No credit card required. Free plan includes 3 invoices/month.</p>
        </div>
      </section>

      {/* Social proof numbers */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { num: "2,000+", label: "Freelancers" },
              { num: "$4.2M+", label: "Invoiced" },
              { num: "98%", label: "Satisfaction" },
              { num: "< 2min", label: "Invoice Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-indigo-600">{stat.num}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to get paid</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Built by freelancers, for freelancers. We know what you need — and what you don't.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Loved by freelancers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex text-yellow-400 mb-4">{"★★★★★"}</div>
                <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-gray-500">Start free, upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="text-xl font-semibold text-gray-900 mb-2">Free</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">$0<span className="text-lg font-normal text-gray-400">/mo</span></div>
              <p className="text-gray-500 text-sm mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                {["3 invoices per month", "Unlimited clients", "PDF export", "Payment tracking", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                Get Started
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-indigo-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">POPULAR</div>
              <div className="text-xl font-semibold text-white mb-2">Pro</div>
              <div className="text-4xl font-bold text-white mb-1">$9<span className="text-lg font-normal text-indigo-200">/mo</span></div>
              <p className="text-indigo-200 text-sm mb-6">For serious freelancers</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited invoices",
                  "Unlimited clients",
                  "PDF export & print",
                  "Revenue analytics",
                  "Custom invoice notes",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <svg className="w-4 h-4 text-indigo-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-indigo-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to get paid faster?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join 2,000+ freelancers who use FreelanceFlow to run their business.</p>
          <Link href="/register" className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg hover:bg-indigo-50 transition-colors">
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold">FreelanceFlow</span>
          </div>
          <p>&copy; {new Date().getFullYear()} FreelanceFlow. Built for freelancers everywhere.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
