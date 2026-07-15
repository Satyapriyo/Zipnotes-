"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Minus, Menu, X } from "lucide-react";
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

type Tier = {
    name: string;
    tag: string;
    monthly: number;
    yearly: number;
    blurb: string;
    cta: string;
    featured?: boolean;
    features: string[];
};

const TIERS: Tier[] = [
    {
        name: "Free",
        tag: "for anyone",
        monthly: 0,
        yearly: 0,
        blurb: "The core notepad, forever. Every device, every keystroke synced.",
        cta: "Start free",
        features: [
            "Unlimited notes",
            "Cloud sync across every device",
            "7 days of version history",
            "Markdown export",
            "Community support",
        ],
    },
    {
        name: "Pro",
        tag: "for daily writers",
        monthly: 4,
        yearly: 40,
        featured: true,
        blurb: "Deeper history, offline vaults, and priority replies from a human.",
        cta: "Upgrade to Pro",
        features: [
            "Everything in Free",
            "Unlimited version history",
            "Offline vault + local encryption",
            "Custom themes (light/dark/paper)",
            "Priority email support · <24h",
        ],
    },
    {
        name: "Team",
        tag: "for small teams",
        monthly: 9,
        yearly: 90,
        blurb: "Shared spaces for the notes you actually want a teammate to see.",
        cta: "Start a team",
        features: [
            "Everything in Pro",
            "Shared team spaces",
            "Roles & granular sharing",
            "SSO (Google & Microsoft)",
            "Admin billing & seat controls",
        ],
    },
];

const MATRIX: { label: string; free: string | boolean; pro: string | boolean; team: string | boolean }[] = [
    { label: "Unlimited notes", free: true, pro: true, team: true },
    { label: "Cloud sync (all devices)", free: true, pro: true, team: true },
    { label: "Markdown export", free: true, pro: true, team: true },
    { label: "Version history", free: "7 days", pro: "Unlimited", team: "Unlimited" },
    { label: "Offline vault", free: false, pro: true, team: true },
    { label: "Local encryption", free: false, pro: true, team: true },
    { label: "Shared team spaces", free: false, pro: false, team: true },
    { label: "SSO (Google / MS)", free: false, pro: false, team: true },
    { label: "Priority support", free: false, pro: "<24h", team: "<8h" },
];

const PRICING_FAQ = [
    {
        q: "Is there really a free plan forever?",
        a: "Yes. The core notepad — unlimited notes, sync across every device, and Markdown export — stays free. We monetize the deeper features that only some people need.",
    },
    {
        q: "Can I switch plans anytime?",
        a: "Upgrade or downgrade whenever. We prorate the difference to the day and never charge for something you're not using.",
    },
    {
        q: "What happens to my notes if I cancel?",
        a: "Nothing. You keep every note. You just drop back to Free — same account, same sync, shorter version history.",
    },
    {
        q: "Do you offer discounts for students or nonprofits?",
        a: "Yes — Pro is free for students with a verified .edu address, and 50% off for registered nonprofits. Reach out from your work email.",
    },
];

function Cell({ v, accent }: { v: string | boolean; accent?: boolean }) {
    if (v === true)
        return (
            <div className="flex justify-center">
                <Check className={`h-4 w-4 ${accent ? "text-ember" : "text-ink"}`} />
            </div>
        );
    if (v === false)
        return (
            <div className="flex justify-center">
                <Minus className="h-4 w-4 text-ink-muted/40" />
            </div>
        );
    return (
        <div className={`text-center font-mono text-[11px] ${accent ? "text-ember-ink" : "text-ink-soft"}`}>
            {v}
        </div>
    );
}

export default function PricingPage() {
    const [yearly, setYearly] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-paper text-ink">
            {/* Nav */}
            <nav className="sticky top-0 z-50 border-b border-rule/70 bg-paper/80 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
                    <Logo />
                    <div className="hidden items-center gap-7 md:flex">
                        <Link href="/" className="text-[13px] text-ink-soft transition-colors hover:text-ink">Home</Link>
                        <Link href="/pricing" className="text-[13px] font-medium text-ink transition-colors">Pricing</Link>
                        <Link href="/compare" className="text-[13px] text-ink-soft transition-colors hover:text-ink">Compare</Link>
                        <Link href="/blog" className="text-[13px] text-ink-soft transition-colors hover:text-ink">Blog</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/sign-in" className="hidden text-[13px] font-medium text-ink-soft transition-colors hover:text-ink sm:inline">
                            Sign in
                        </Link>
                        <Link
                            href="/sign-up"
                            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-mono text-[12px] font-medium text-paper transition-all hover:bg-ink-soft"
                        >
                            Start free
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
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
                        <a href="#faq" onClick={() => setMenuOpen(false)} className="text-sm text-ink-soft">FAQ</a>
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
            <header className="relative mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink-soft"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                    pricing · no hidden line items
                </motion.div>
                <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[3.5rem]">
                    One product. Three prices.{" "}
                    <span className="font-editorial italic text-ember">Zero surprises.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
                    Every plan gets the same fast, quiet editor. Paid tiers just unlock the corners
                    heavier users need — deeper history, offline vaults, team spaces.
                </p>

                {/* Billing toggle */}
                <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-rule bg-paper-2/60 p-1">
                    <button
                        onClick={() => setYearly(false)}
                        className={`relative rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${!yearly ? "text-paper" : "text-ink-soft hover:text-ink"
                            }`}
                    >
                        {!yearly && (
                            <motion.span
                                layoutId="billing-pill"
                                className="absolute inset-0 rounded-full bg-ink"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative">Monthly</span>
                    </button>
                    <button
                        onClick={() => setYearly(true)}
                        className={`relative rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${yearly ? "text-paper" : "text-ink-soft hover:text-ink"
                            }`}
                    >
                        {yearly && (
                            <motion.span
                                layoutId="billing-pill"
                                className="absolute inset-0 rounded-full bg-ink"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative inline-flex items-center gap-1.5">
                            Yearly <span className="rounded-sm bg-ember/15 px-1 py-px font-mono text-[9px] uppercase tracking-wider text-ember-ink">−17%</span>
                        </span>
                    </button>
                </div>
            </header>

            {/* Tiers */}
            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
                <div className="grid gap-5 md:grid-cols-3">
                    {TIERS.map((t, i) => {
                        const price = yearly ? Math.round(t.yearly / 12) : t.monthly;
                        return (
                            <Reveal key={t.name} delay={i * 0.08}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.3, ease }}
                                    className={`relative flex h-full flex-col rounded-2xl border p-7 transition-shadow sm:p-8 ${t.featured
                                        ? "border-ink bg-ink text-paper shadow-[0_30px_60px_-30px_rgba(28,25,23,0.5)]"
                                        : "border-rule bg-paper hover:shadow-[0_20px_40px_-24px_rgba(28,25,23,0.2)]"
                                        }`}
                                >
                                    {t.featured && (
                                        <span className="absolute -top-2.5 left-6 rounded-full bg-ember px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper">
                                            most loved
                                        </span>
                                    )}
                                    <div className="mb-6 flex items-baseline justify-between">
                                        <div>
                                            <div className={`font-display text-xl font-medium ${t.featured ? "text-paper" : "text-ink"}`}>
                                                {t.name}
                                            </div>
                                            <div className={`mt-0.5 font-mono text-[10px] uppercase tracking-wider ${t.featured ? "text-paper/60" : "text-ink-muted"}`}>
                                                {t.tag}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2 flex items-baseline gap-1">
                                        <span className={`font-display text-5xl font-medium tracking-tight ${t.featured ? "text-paper" : "text-ink"}`}>
                                            ${price}
                                        </span>
                                        <span className={`font-mono text-[12px] ${t.featured ? "text-paper/60" : "text-ink-muted"}`}>
                                            /mo
                                        </span>
                                    </div>
                                    <p className={`mb-6 text-[13px] leading-relaxed ${t.featured ? "text-paper/70" : "text-ink-soft"}`}>
                                        {t.blurb}
                                    </p>

                                    <ul className="mb-8 space-y-2.5">
                                        {t.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2.5 text-[13px]">
                                                <Check
                                                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${t.featured ? "text-ember" : "text-ember-ink"
                                                        }`}
                                                />
                                                <span className={t.featured ? "text-paper/85" : "text-ink-soft"}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/sign-up"
                                        className={`group mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium transition-all hover:translate-y-[-1px] ${t.featured
                                            ? "bg-ember text-paper hover:bg-ember/90"
                                            : "bg-ink text-paper hover:bg-ink-soft"
                                            }`}
                                    >
                                        {t.cta}
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </motion.div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* Feature matrix */}
            <section className="border-y border-rule bg-paper-2/40 py-20 sm:py-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <Reveal>
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            02 / everything, side by side
                        </div>
                        <h2 className="mb-10 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                            Compare <span className="font-editorial italic">plans</span>.
                        </h2>
                    </Reveal>

                    <Reveal delay={0.05}>
                        <div className="overflow-hidden rounded-2xl border border-rule bg-paper">
                            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-b border-rule bg-paper-2/60 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-muted sm:px-6">
                                <div>feature</div>
                                <div className="text-center">Free</div>
                                <div className="text-center text-ember-ink">Pro</div>
                                <div className="text-center">Team</div>
                            </div>
                            {MATRIX.map((row, i) => (
                                <motion.div
                                    key={row.label}
                                    initial={{ opacity: 0, x: -8 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.4, delay: i * 0.03, ease }}
                                    className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-t border-rule px-5 py-4 text-[13px] first:border-t-0 hover:bg-paper-2/40 sm:px-6"
                                >
                                    <div className="text-ink">{row.label}</div>
                                    <Cell v={row.free} />
                                    <Cell v={row.pro} accent />
                                    <Cell v={row.team} />
                                </motion.div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28">
                <Reveal>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        03 / pricing questions
                    </div>
                    <h2 className="mb-10 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                        The <span className="font-editorial italic">honest</span> answers.
                    </h2>
                </Reveal>
                <div className="space-y-3">
                    {PRICING_FAQ.map((f, i) => (
                        <Reveal key={f.q} delay={i * 0.04}>
                            <details className="group rounded-2xl border border-rule bg-paper p-5 transition-colors open:bg-paper-2/40 sm:p-6">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                                    <span className="font-medium text-ink">{f.q}</span>
                                    <span className="grid h-6 w-6 place-items-center rounded-full border border-rule text-ink-muted transition-transform group-open:rotate-45 group-open:border-ember group-open:text-ember">
                                        +
                                    </span>
                                </summary>
                                <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{f.a}</p>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-rule bg-paper-2/40">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
                    <Reveal>
                        <h2 className="mb-6 font-display text-3xl font-medium tracking-[-0.03em] sm:text-[2.75rem]">
                            Start on Free. Stay if you{" "}
                            <span className="font-editorial italic">need to.</span>
                        </h2>
                        <p className="mx-auto mb-9 max-w-md text-[15px] text-ink-soft">
                            No credit card. Upgrade the day you outgrow it — not before.
                        </p>
                        <Link
                            href="/sign-up"
                            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft"
                        >
                            Create your account
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </Reveal>
                </div>
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