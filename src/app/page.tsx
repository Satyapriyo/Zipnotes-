import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Building2,
  Zap,
  Cloud,
  ShieldCheck,
} from "lucide-react";

const font = Inter({ subsets: ["latin"] });

export default function HomePage() {
  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0B1120] selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-100 ${font.className}`}>

      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ZipNotes</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Claim Beta Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Free beta access for the first 100 users
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
            Simple, affordable cloud notes that work <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 dark:from-indigo-400 to-blue-500 dark:to-blue-400">where Notion is blocked.</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The note-taking app your office will actually allow. Secure, lightweight, and clutter-free.
            Stop fighting complex tools and start capturing your ideas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/20">
                Get Free Beta Access <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400 sm:ml-4">Only 100 spots available.</span>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-white dark:bg-[#0B1120] border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why switch to ZipNotes?</h2>
              <p className="text-slate-600 dark:text-slate-400">You just want to take notes. Notion tries to be everything.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* The Problem */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <XCircle className="text-red-500 w-6 h-6" /> The Other Guys
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <span className="shrink-0 text-red-500 font-bold">❌</span>
                    <span><strong className="text-slate-900 dark:text-slate-200">Blocked in offices</strong> (Notion is often restricted)</span>
                  </li>
                  <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <span className="shrink-0 text-red-500 font-bold">❌</span>
                    <span><strong className="text-slate-900 dark:text-slate-200">Expensive</strong> (Evernote/OneNote charge premium prices)</span>
                  </li>
                  <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <span className="shrink-0 text-red-500 font-bold">❌</span>
                    <span><strong className="text-slate-900 dark:text-slate-200">Overly complex</strong> (Too many features you don&apos;t need)</span>
                  </li>
                  <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <span className="shrink-0 text-red-500 font-bold">❌</span>
                    <span><strong className="text-slate-900 dark:text-slate-200">Heavy & slow</strong> (Takes too long to load a simple text file)</span>
                  </li>
                </ul>
              </div>

              {/* The Solution */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5">
                  <BookOpen className="w-32 h-32 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-indigo-950 dark:text-indigo-100 mb-6 flex items-center gap-2 relative z-10">
                  <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 w-6 h-6" /> ZipNotes
                </h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-3 text-indigo-900 dark:text-indigo-200">
                    <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 w-5 h-5 shrink-0" />
                    <span><strong className="text-indigo-950 dark:text-indigo-100">Office-friendly:</strong> Rarely blocked by corporate networks.</span>
                  </li>
                  <li className="flex gap-3 text-indigo-900 dark:text-indigo-200">
                    <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 w-5 h-5 shrink-0" />
                    <span><strong className="text-indigo-950 dark:text-indigo-100">Free for Beta:</strong> First 100 users pay nothing. Affordable after.</span>
                  </li>
                  <li className="flex gap-3 text-indigo-900 dark:text-indigo-200">
                    <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 w-5 h-5 shrink-0" />
                    <span><strong className="text-indigo-950 dark:text-indigo-100">Fast & Simple:</strong> No clutter. Just open and type.</span>
                  </li>
                  <li className="flex gap-3 text-indigo-900 dark:text-indigo-200">
                    <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 w-5 h-5 shrink-0" />
                    <span><strong className="text-indigo-950 dark:text-indigo-100">Cloud-Backed:</strong> Safely synced across all your devices.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features/Target Audience */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Built for people who just want to write.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Restricted Professionals</h3>
              <p className="text-slate-600 dark:text-slate-400">Perfect for employees whose offices block heavy productivity platforms like Notion.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Minimalists</h3>
              <p className="text-slate-600 dark:text-slate-400">No databases, no boards, no complex formatting. Just a lightning-fast editor for your brain.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Value Seekers</h3>
              <p className="text-slate-600 dark:text-slate-400">Stop paying $10/month just to sync basic text files across your laptop and phone.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Is ZipNotes really free?</h4>
                <p className="text-slate-600 dark:text-slate-400">Yes! The first 100 beta testers get free access. After beta, we&apos;ll have affordable paid plans (much cheaper than Evernote or Notion).</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Why is Notion blocked but ZipNotes isn&apos;t?</h4>
                <p className="text-slate-600 dark:text-slate-400">Notion is often blocked by corporate firewalls because it&apos;s a massive productivity platform with file sharing that triggers security policies. ZipNotes is a simple text app that flies under the radar of most office restrictions.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Are my notes stored in the cloud?</h4>
                <p className="text-slate-600 dark:text-slate-400">Yes — your notes are safely backed up in the cloud and instantly accessible from any device with an internet connection.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20">
                <div className="mt-1">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-indigo-950 dark:text-indigo-100 mb-2">How many beta spots are left?</h4>
                  <p className="text-indigo-900 dark:text-indigo-200">There is a hard limit of 100 total spots to ensure server stability during testing. Sign up now to secure yours before they run out!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden dark:border dark:border-slate-800">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to take notes without the noise?
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                Join the beta today. 100 free spots — don&apos;t wait! Secure cloud notes without the expensive subscriptions.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 text-lg">
                  🔥 Claim Your Free Beta Access
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} ZipNotes. All rights reserved.</p>
      </footer>
    </div>
  );
}