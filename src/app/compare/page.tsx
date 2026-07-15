"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Menu, Minus, X } from "lucide-react";
import { Logo } from "@/components/zn/Logo";

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type Cell = string | boolean;
const APPS = ["ZipNotes", "Notion", "Evernote", "Obsidian", "Apple Notes"] as const;

const ROWS: { label: string; values: Cell[] }[] = [
  { label: "Cold start", values: ["0.4s", "6–10s", "3–5s", "1.5s", "0.8s"] },
  { label: "Install / bundle size", values: ["2.4 MB", "~210 MB", "~180 MB", "~90 MB", "system"] },
  { label: "Cross-device sync", values: [true, true, true, "paid add-on", "Apple only"] },
  { label: "Works offline", values: [true, "limited", "limited", true, true] },
  { label: "Markdown-first", values: [true, false, false, true, false] },
  { label: "Plain-text export", values: [true, "partial", "partial", true, false] },
  { label: "Firewall-friendly", values: [true, false, false, true, "N/A"] },
  { label: "Free plan usable daily", values: [true, "limited", "limited", true, true] },
  { label: "Cheapest paid tier", values: ["$4/mo", "$10/mo", "$15/mo", "$4/mo *", "iCloud+"] },
  { label: "Time to first note", values: ["<5s", "~2 min", "~1 min", "~3 min", "<5s"] },
];

const VERDICTS = [
  {
    name: "vs Notion",
    body: "Notion is a workspace. ZipNotes is a notepad. If you spend more time configuring pages than writing in them, the trade is worth making.",
    good: ["Half a second to type", "Nothing to set up", "Under $5/mo Pro"],
    bad: ["No databases or boards", "No embeds", "Not a wiki"],
  },
  {
    name: "vs Evernote",
    body: "Evernote's pricing pushed a lot of writers away. ZipNotes keeps the notebook feel but drops the price tag and the launch time.",
    good: ["12× smaller install", "Free sync across devices", "No upsell in the sidebar"],
    bad: ["No web clipper (yet)", "No handwriting"],
  },
  {
    name: "vs Obsidian",
    body: "Obsidian is beloved for a reason — but sync is a paid add-on and setup is a hobby. ZipNotes is sync-first and setup-free.",
    good: ["Free sync built-in", "Runs in any browser", "Zero plugin management"],
    bad: ["No graph view", "No local-vault power tools"],
  },
  {
    name: "vs Apple Notes",
    body: "Apple Notes is great if your whole life is on Apple. ZipNotes is for the rest of the internet — every browser, every device.",
    good: ["Works everywhere", "Markdown export", "Team spaces on Pro"],
    bad: ["No handwriting", "No shared iCloud folders"],
  },
];

export default function ComparePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="sticky top-0 z-50 border-b border-rule/70 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Logo />
          <div className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-[13px] text-ink-soft hover:text-ink">Home</Link>
            <Link href="/pricing" className="text-[13px] text-ink-soft hover:text-ink">Pricing</Link>
            <Link href="/compare" className="text-[13px] font-medium text-ink">Compare</Link>
            <Link href="/blog" className="text-[13px] text-ink-soft hover:text-ink">Blog</Link>
          </div>
          <Link
            href="/sign-up"
            className="hidden sm:inline-flex group items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-mono text-[12px] font-medium text-paper hover:bg-ink-soft"
          >
            Start free <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="-mr-2 p-2 text-ink-soft md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease }}
            className="flex flex-col gap-3 border-t border-rule bg-paper px-4 py-4 md:hidden absolute w-full"
          >
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-sm text-ink-soft">Pricing</Link>
            <Link href="/compare" onClick={() => setMenuOpen(false)} className="text-sm text-ink-soft">Compare</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-sm text-ink-soft">Blog</Link>
            <div className="mt-2 flex gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full border border-rule px-3 py-2 text-center text-sm text-ink-soft"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full bg-ink px-3 py-2 text-center font-mono text-xs text-paper"
              >
                Start free
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <header className="relative mx-auto max-w-4xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink-soft"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          honest comparison · updated jun 2026
        </motion.div>
        <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[3.5rem]">
          The other note apps —{" "}
          <span className="font-editorial italic text-ember">side by side.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          We built ZipNotes because the tools we tried were slow, expensive, or blocked by
          our IT teams. Here's how it stacks up against the big ones, without spin.
        </p>
      </header>

      {/* Big matrix */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-rule bg-paper shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_30px_60px_-40px_rgba(28,25,23,0.25)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-[13px]">
                <thead className="bg-paper-2/60">
                  <tr>
                    <th className="w-[220px] border-b border-rule px-5 py-4 text-left font-mono text-[10px] font-normal uppercase tracking-wider text-ink-muted sm:px-6">
                      feature
                    </th>
                    {APPS.map((a, i) => (
                      <th
                        key={a}
                        className={`border-b border-rule px-4 py-4 text-center font-mono text-[11px] font-medium ${
                          i === 0 ? "text-ember-ink" : "text-ink"
                        }`}
                      >
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, ri) => (
                    <motion.tr
                      key={row.label}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: ri * 0.03, ease }}
                      className="border-t border-rule first:border-t-0 hover:bg-paper-2/40"
                    >
                      <td className="px-5 py-4 text-ink sm:px-6">{row.label}</td>
                      {row.values.map((v, ci) => (
                        <td key={ci} className={`px-4 py-4 text-center ${ci === 0 ? "bg-ember/[0.04]" : ""}`}>
                          <CellView v={v} accent={ci === 0} />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 font-mono text-[11px] text-ink-muted">
          * Obsidian Sync is a paid add-on. Local Obsidian is free.
        </p>
      </section>

      {/* Verdicts */}
      <section className="border-y border-rule bg-paper-2/40 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
              02 / the fine print
            </div>
            <h2 className="mb-12 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
              What we <span className="font-editorial italic">actually</span> think.
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {VERDICTS.map((v, i) => (
              <Reveal key={v.name} delay={(i % 2) * 0.08}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease }}
                  className="h-full rounded-2xl border border-rule bg-paper p-7 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(28,25,23,0.2)] sm:p-8"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    zipnotes
                  </div>
                  <h3 className="font-editorial text-2xl text-ink">{v.name}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{v.body}</p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-rule pt-5">
                    <div>
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ember-ink">
                        we win on
                      </div>
                      <ul className="space-y-1.5">
                        {v.good.map((g) => (
                          <li key={g} className="flex items-start gap-1.5 text-[12.5px] text-ink">
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-ember" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                        we don't do
                      </div>
                      <ul className="space-y-1.5">
                        {v.bad.map((b) => (
                          <li key={b} className="flex items-start gap-1.5 text-[12.5px] text-ink-soft">
                            <X className="mt-0.5 h-3 w-3 shrink-0 text-ink-muted/60" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <h2 className="mb-6 font-display text-3xl font-medium tracking-[-0.03em] sm:text-[2.75rem]">
            Try the one that's{" "}
            <span className="font-editorial italic">already open</span>.
          </h2>
          <p className="mx-auto mb-9 max-w-md text-[15px] text-ink-soft">
            No install. No signup wall. Open a blank page in under half a second.
          </p>
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft"
          >
            Start writing — free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-rule bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo small />
          <div className="font-mono text-[11px] text-ink-muted">© 2026 ZipNotes · made small on purpose</div>
        </div>
      </footer>
    </div>
  );
}

function CellView({ v, accent }: { v: Cell; accent?: boolean }) {
  if (v === true)
    return <Check className={`mx-auto h-4 w-4 ${accent ? "text-ember" : "text-ink"}`} />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-ink-muted/40" />;
  return (
    <span className={`font-mono text-[11.5px] ${accent ? "text-ember-ink" : "text-ink-soft"}`}>
      {v}
    </span>
  );
}