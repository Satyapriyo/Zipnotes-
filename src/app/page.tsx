"use client";
import React, { useState, useEffect } from "react";
import {
  Zap,
  Lock,
  Cloud,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .zn-display { font-family: 'Space Grotesk', sans-serif; }
  .zn-mono { font-family: 'JetBrains Mono', monospace; }
  .zn-body { font-family: 'Inter', sans-serif; }

  @keyframes zn-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
  .zn-cursor { display: inline-block; animation: zn-blink 1s steps(1) infinite; }
`;

const SPOTS_TOTAL = 100;
const SPOTS_CLAIMED = 64;

const FOOTPRINT = [
  { name: "ZipNotes", size: "2.4 MB", load: "0.4s", pct: 4, accent: true },
  { name: "All-in-one workspace suite", size: "~210 MB", load: "7–12s", pct: 96 },
  { name: "Legacy note app + sync client", size: "~85 MB", load: "3–5s", pct: 52 },
];

const DIFF_LINES = [
  { type: "minus", text: "Often blocked by corporate firewalls and content filters" },
  { type: "plus", text: "Loads as one small request — rarely flagged by IT" },
  { type: "minus", text: "$8–15/month just to sync notes across devices" },
  { type: "plus", text: "Free during beta, simple low-cost plans after" },
  { type: "minus", text: "Wikis, databases, and boards you'll never open" },
  { type: "plus", text: "One page. Type. It saves itself" },
  { type: "minus", text: "5–10 second cold start on a locked-down laptop" },
  { type: "plus", text: "Opens to a blank page in under half a second" },
];

const FEATURES = [
  {
    icon: Lock,
    tag: "for://restricted-professionals",
    title: "Restricted professionals",
    body: "For anyone whose IT department treats heavyweight workspace apps as a security risk.",
  },
  {
    icon: Zap,
    tag: "for://minimalists",
    title: "Minimalists",
    body: "No nested pages, boards, or databases to configure. Open it, start typing, done.",
  },
  {
    icon: Cloud,
    tag: "for://value-seekers",
    title: "Value seekers",
    body: "Stop paying a monthly fee just to sync plain text between your laptop and your phone.",
  },
];

const FAQS = [
  {
    q: "Is ZipNotes really free?",
    a: "Yes. The first 100 beta testers get full access at no cost. After beta, pricing stays simple and well below what most all-in-one workspace apps charge.",
  },
  {
    q: "Why does this get through firewalls that block other apps?",
    a: "Big workspace platforms bundle file storage, embeds, and trackers that trip security filters. ZipNotes is just a small, text-based app — it has far less for a firewall to flag.",
  },
  {
    q: "Are my notes backed up anywhere?",
    a: "Yes — everything saves to the cloud automatically and stays in sync across every device you're signed into.",
  },
  {
    q: "How many beta spots are actually left?",
    a: `${SPOTS_TOTAL - SPOTS_CLAIMED} spots remain, capped to keep beta servers fast and stable. Once they're gone, you'll be added to the waitlist for general access.`,
    highlight: true,
  },
];

export default function ZipNotesLanding() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="zn-body min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <style>{FONT_STYLES}</style>

      {/* top "loading bar" accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-lime-400 via-lime-300 to-transparent" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-lime-300">
              <Zap className="h-4 w-4 text-lime-300 dark:text-slate-900" fill="currentColor" />
            </span>
            <span className="zn-display text-lg font-semibold tracking-tight">ZipNotes</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#compare" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Compare</a>
            <a href="#features" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Who it's for</a>
            <a href="#faq" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="sign-up" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign in
            </a>
            <a
              href="sign-up"
              className="zn-mono text-sm font-medium rounded-full bg-slate-900 dark:bg-lime-300 text-lime-300 dark:text-slate-900 px-4 py-2 hover:bg-slate-800 dark:hover:bg-lime-200 transition-colors"
            >
              Get beta access
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-slate-700 dark:text-slate-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-col gap-4 bg-slate-50 dark:bg-slate-950">
            <a href="#compare" onClick={() => setMenuOpen(false)} className="text-sm text-slate-600 dark:text-slate-300">Compare</a>
            <a href="#features" onClick={() => setMenuOpen(false)} className="text-sm text-slate-600 dark:text-slate-300">Who it's for</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="text-sm text-slate-600 dark:text-slate-300">FAQ</a>
            <a
              href="signup"
              onClick={() => setMenuOpen(false)}
              className="zn-mono text-sm font-medium rounded-full bg-slate-900 dark:bg-lime-300 text-lime-300 dark:text-slate-900 px-4 py-2 text-center"
            >
              Get beta access
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <header id="top" className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="zn-mono inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500" />
              </span>
              beta · {SPOTS_TOTAL - SPOTS_CLAIMED} spots left · free
            </div>

            <h1 className="zn-display mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08]">
              The note app that's small enough to get past IT.
              <span className="zn-cursor text-lime-400">_</span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              ZipNotes is a featherweight, cloud-synced notepad built for networks that block
              everything else. No workspaces, no databases, nothing for the firewall to flag —
              just open it and write.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="sign-up"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-lime-300 text-lime-300 dark:text-slate-900 px-6 py-3.5 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-lime-200 transition-colors"
              >
                Claim your beta spot
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#compare"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4"
              >
                See the size difference
              </a>
            </div>

            <div className="mt-10 max-w-xs">
              <div className="zn-mono flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>{SPOTS_CLAIMED} / {SPOTS_TOTAL} claimed</span>
                <span>{SPOTS_TOTAL - SPOTS_CLAIMED} left</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-lime-400 transition-all duration-1000 ease-out"
                  style={{ width: mounted ? `${(SPOTS_CLAIMED / SPOTS_TOTAL) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>

          {/* Footprint comparison — signature element */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <div className="zn-mono text-xs text-slate-400 dark:text-slate-500 mb-6">// footprint check</div>
            <div className="space-y-5">
              {FOOTPRINT.map((row, i) => (
                <div key={row.name}>
                  <div className="flex items-baseline justify-between mb-1.5 gap-3">
                    <span
                      className={`zn-mono text-sm ${row.accent ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-slate-400"
                        }`}
                    >
                      {row.name}
                    </span>
                    <span className="zn-mono text-xs text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                      {row.size} · {row.load}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.accent ? "bg-lime-400" : "bg-slate-300 dark:bg-slate-700"}`}
                      style={{
                        width: mounted ? `${row.pct}%` : "0%",
                        transitionProperty: "width",
                        transitionTimingFunction: "ease-out",
                        transitionDuration: "1200ms",
                        transitionDelay: `${i * 150}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="zn-mono text-xs text-slate-400 dark:text-slate-500 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              smaller install → fewer firewall flags → it just opens.
            </p>
          </div>
        </div>
      </header>

      {/* Comparison — diff */}
      <section id="compare" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="zn-mono text-xs text-lime-600 dark:text-lime-400 mb-3">// 02 — what changes</div>
          <h2 className="zn-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            The fine print, in plain diff.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-xl">
            Here's what actually changes when you swap a heavyweight workspace app for something
            built to do one thing.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-lime-400/70" />
              <span className="zn-mono text-xs text-slate-400 ml-2">compare.diff</span>
            </div>
            <div className="zn-mono text-sm leading-relaxed px-4 sm:px-6 py-5 overflow-x-auto">
              {DIFF_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-3 py-1 whitespace-nowrap sm:whitespace-normal ${line.type === "minus" ? "text-rose-300/90" : "text-lime-300/90"
                    }`}
                >
                  <span className="select-none">{line.type === "minus" ? "−" : "+"}</span>
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features / audience */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-2xl mb-14">
          <div className="zn-mono text-xs text-lime-600 dark:text-lime-400 mb-3">// 03 — who it's for</div>
          <h2 className="zn-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Built for three kinds of people.
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            If you've ever wished a productivity app did less, ZipNotes was made with you in mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-px rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 overflow-hidden">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white dark:bg-slate-950 p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="zn-mono text-xs text-slate-400 dark:text-slate-500 mb-6">{f.tag}</div>
                <div className="h-10 w-10 rounded-lg bg-lime-100 dark:bg-lime-400/10 text-lime-600 dark:text-lime-300 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="zn-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="zn-mono text-xs text-lime-600 dark:text-lime-400 mb-3">// 04 — faq</div>
          <h2 className="zn-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
            Questions, answered.
          </h2>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`font-medium ${item.highlight ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200"
                        }`}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: open ? "240px" : "0px" }}
                  >
                    <p
                      className={`pb-5 text-sm leading-relaxed ${item.highlight ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      {item.a}
                    </p>
                    {item.highlight && (
                      <div className="pb-5">
                        <div className="h-1.5 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-lime-400"
                            style={{ width: `${(SPOTS_CLAIMED / SPOTS_TOTAL) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="signup" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 sm:px-16 py-16 sm:py-24 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-lime-400/20 blur-3xl" />
          <div className="relative">
            <div className="zn-mono inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 mb-6">
              {SPOTS_TOTAL - SPOTS_CLAIMED} of {SPOTS_TOTAL} spots remaining
            </div>
            <h2 className="zn-display text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-5 max-w-2xl mx-auto">
              Your next note is one tap away.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Free for beta testers, simple pricing after. No installs, no IT tickets, and nothing
              for the proxy to choke on.
            </p>
            <a
              href="sign-up"
              className="group inline-flex items-center gap-2 rounded-full bg-lime-300 text-slate-900 px-7 py-4 text-sm font-semibold hover:bg-lime-200 transition-colors"
            >
              Claim your free beta access
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 dark:bg-lime-300">
              <Zap className="h-3 w-3 text-lime-300 dark:text-slate-900" fill="currentColor" />
            </span>
            <span className="zn-mono">ZipNotes</span>
          </div>
          <p className="zn-mono text-xs">small app, big margins — © 2026</p>
        </div>
      </footer>
    </div>
  );
}