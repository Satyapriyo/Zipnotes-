"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
    Cloud,
    Lock,
    Menu,
    Quote,
    Star,
    X,
    Zap,
} from "lucide-react";
import { Logo } from "@/components/zn/Logo";
import {
    DIFF_LINES,
    FAQS,
    FOOTPRINT,
    STATS,
    TESTIMONIALS,
    WORKFLOW,
} from "@/lib/zipnotes-data";

const FEATURES = [
    {
        icon: Lock,
        tag: "for/restricted-professionals",
        title: "Restricted professionals",
        body: "For anyone whose IT department treats heavyweight workspace apps as a security risk.",
    },
    {
        icon: Zap,
        tag: "for/minimalists",
        title: "Minimalists",
        body: "No nested pages, boards, or databases to configure. Open it, start typing, done.",
    },
    {
        icon: Cloud,
        tag: "for/value-seekers",
        title: "Value seekers",
        body: "Stop paying a monthly fee just to sync plain text between your laptop and your phone.",
    },
];

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
    children,
    delay = 0,
    y = 16,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay, ease }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function Landing() {
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(-1);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.4 });

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 200);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen bg-paper text-ink">
            {/* Scroll progress bar */}
            <motion.div
                style={{ scaleX }}
                className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-ember"
            />

            {/* Nav */}
            <nav className="sticky top-0 z-50 border-b border-rule/70 bg-paper/80 backdrop-blur-xl">
                <div className="mx-auto grid h-14 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:h-16 sm:px-6 md:grid-cols-3">
                    <Logo />

                    <div className="hidden items-center justify-center gap-7 md:flex">
                        <Link href="/pricing" className="group relative text-[13px] text-ink-soft transition-colors hover:text-ink">
                            Pricing
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/compare" className="group relative text-[13px] text-ink-soft transition-colors hover:text-ink">
                            Compare
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/blog" className="group relative text-[13px] text-ink-soft transition-colors hover:text-ink">
                            Blog
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <a href="#faq" className="group relative text-[13px] text-ink-soft transition-colors hover:text-ink">
                            FAQ
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
                        </a>
                    </div>

                    <div className="hidden items-center justify-end gap-3 md:flex">
                        <Link
                            href="/sign-in"
                            className="text-[13px] font-medium text-ink-soft transition-colors hover:text-ink"
                        >
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

                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="flex flex-col gap-3 border-t border-rule bg-paper px-4 py-4 md:hidden"
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
            <header id="top" className="relative mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
                <div className="pointer-events-none absolute right-4 top-12 hidden font-editorial text-[14rem] leading-none text-ink/[0.04] lg:block">
                    01
                </div>

                <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease }}
                            className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink-soft"
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
                            </span>
                            now available · trusted by 12,000+ writers
                        </motion.div>

                        <h1 className="mt-6 font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.25rem] lg:text-[3.75rem]">
                            {["The", "note", "app", "that's"].map((w, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease }}
                                    className="mr-[0.22em] inline-block"
                                >
                                    {w}
                                </motion.span>
                            ))}
                            <motion.span
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.42, ease }}
                                className="font-editorial italic text-ember"
                            >
                                small enough
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.55, ease }}
                                className="inline-block"
                            >
                                to get past IT.
                            </motion.span>
                            <span className="cursor-blink ml-0.5 inline-block text-ember">▍</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.7, ease }}
                            className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-soft"
                        >
                            A featherweight, cloud-synced notepad built for networks that block everything
                            else. No workspaces, no databases — just open it and write.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.85, ease }}
                            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
                        >
                            <Link
                                href="/sign-up"
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-paper shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_8px_24px_-12px_rgba(28,25,23,0.5)] transition-all hover:translate-y-[-1px] hover:bg-ink-soft"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                Start writing — free
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <a
                                href="#compare"
                                className="text-[13px] font-medium text-ink-soft underline decoration-rule decoration-1 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ember"
                            >
                                See the size difference
                            </a>
                        </motion.div>

                        {/* Stat strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1, ease }}
                            className="mt-12 grid max-w-md grid-cols-2 gap-y-5 gap-x-8 border-t border-rule pt-6 sm:grid-cols-4 sm:gap-x-6"
                        >
                            {STATS.map((s) => (
                                <div key={s.label}>
                                    <div className="font-display text-xl font-medium tracking-tight text-ink">
                                        {s.value}
                                    </div>
                                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Footprint card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, rotate: -1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease }}
                        className="relative rounded-2xl border border-rule bg-paper-2/60 p-6 backdrop-blur-sm sm:p-8"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                                footprint.check
                            </span>
                            <span className="font-mono text-[10px] text-ink-muted">live</span>
                        </div>
                        <div className="space-y-5">
                            {FOOTPRINT.map((row, i) => (
                                <div key={row.name}>
                                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                                        <span
                                            className={
                                                row.accent
                                                    ? "font-mono text-[13px] font-medium text-ink"
                                                    : "font-mono text-[13px] text-ink-muted"
                                            }
                                        >
                                            {row.name}
                                        </span>
                                        <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-ink-muted">
                                            {row.size} · {row.load}
                                        </span>
                                    </div>
                                    <div className="h-[6px] w-full overflow-hidden rounded-full bg-paper-3">
                                        <div
                                            className={`h-full rounded-full ${row.accent ? "bg-ember" : "bg-ink/25"}`}
                                            style={{
                                                width: mounted ? `${row.pct}%` : "0%",
                                                transitionProperty: "width",
                                                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                                                transitionDuration: "1400ms",
                                                transitionDelay: `${i * 180 + 300}ms`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 border-t border-rule pt-5 font-mono text-[11px] leading-relaxed text-ink-muted">
                            smaller install → fewer firewall flags → it just opens.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Marquee strip */}
            <div className="overflow-hidden border-y border-rule bg-paper-2/40 py-4">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ duration: 38, ease: "linear", repeat: Infinity }}
                    className="flex shrink-0 gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted"
                >
                    {Array.from({ length: 2 }).flatMap((_, k) =>
                        [
                            "one page, type, save",
                            "★",
                            "12,000+ writers",
                            "★",
                            "loved by IT-restricted teams",
                            "★",
                            "0.4s cold start",
                            "★",
                            "no databases · no boards",
                            "★",
                            "plain markdown export",
                            "★",
                        ].map((t, i) => (
                            <span key={`${k}-${i}`} className="shrink-0">
                                {t}
                            </span>
                        )),
                    )}
                </motion.div>
            </div>

            {/* Compare / diff */}
            <section id="compare" className="border-b border-rule bg-paper-2/40 py-20 sm:py-28">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <Reveal>
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            02 / what changes
                        </div>
                        <h2 className="mb-4 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                            The fine print, in <span className="font-editorial italic">plain diff</span>.
                        </h2>
                        <p className="mb-10 max-w-xl text-ink-soft">
                            Here's what actually changes when you swap a heavyweight workspace app for
                            something built to do one thing.
                        </p>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="overflow-hidden rounded-2xl border border-rule bg-paper shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_20px_40px_-24px_rgba(28,25,23,0.18)]">
                            <div className="flex items-center gap-2 border-b border-rule bg-paper-2/60 px-4 py-3">
                                <span className="h-2 w-2 rounded-full bg-ink/20" />
                                <span className="h-2 w-2 rounded-full bg-ink/20" />
                                <span className="h-2 w-2 rounded-full bg-ember" />
                                <span className="ml-2 font-mono text-[11px] text-ink-muted">compare.diff</span>
                            </div>
                            <div className="overflow-x-auto px-4 py-5 font-mono text-[13px] leading-[1.9] sm:px-6">
                                {DIFF_LINES.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-40px" }}
                                        transition={{ duration: 0.5, delay: i * 0.05, ease }}
                                        className={`flex gap-3 ${line.type === "minus"
                                                ? "text-ink-muted line-through decoration-ink-muted/30"
                                                : "text-ink"
                                            }`}
                                    >
                                        <span className={`select-none ${line.type === "minus" ? "text-ink-muted" : "text-ember"}`}>
                                            {line.type === "minus" ? "−" : "+"}
                                        </span>
                                        <span>{line.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
                <Reveal>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        03 / how it works
                    </div>
                    <h2 className="mb-14 max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                        Three steps, then{" "}
                        <span className="font-editorial italic">none</span>.
                    </h2>
                </Reveal>

                <div className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
                    {WORKFLOW.map((s, i) => (
                        <Reveal key={s.step} delay={i * 0.08}>
                            <div className="group relative h-full bg-paper p-8 transition-colors hover:bg-paper-2/60">
                                <div className="mb-8 flex items-baseline justify-between">
                                    <span className="font-editorial text-5xl text-ember">{s.step}</span>
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                        step
                                    </span>
                                </div>
                                <h3 className="mb-2 font-display text-xl font-medium tracking-tight">{s.title}</h3>
                                <p className="text-[14px] leading-relaxed text-ink-soft">{s.body}</p>
                                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-ember transition-all duration-500 group-hover:w-full" />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Features / who it's for */}
            <section id="features" className="border-y border-rule bg-paper-2/40 py-20 sm:py-28">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <Reveal>
                        <div className="mb-14 max-w-2xl">
                            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                                04 / who it's for
                            </div>
                            <h2 className="mb-4 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                                Built for three kinds of{" "}
                                <span className="font-editorial italic">people</span>.
                            </h2>
                            <p className="text-ink-soft">
                                If you've ever wished a productivity app did less, ZipNotes was made with you in mind.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <Reveal key={f.title} delay={i * 0.08}>
                                    <div className="group relative h-full bg-paper p-7 transition-colors hover:bg-paper sm:p-8">
                                        <div className="mb-5 flex items-center justify-between">
                                            <div className="grid h-9 w-9 place-items-center rounded-lg border border-rule bg-paper-2 text-ink-soft transition-colors group-hover:border-ember/40 group-hover:text-ember">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                                0{i + 1}
                                            </span>
                                        </div>
                                        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                            {f.tag}
                                        </div>
                                        <h3 className="mb-2 font-display text-lg font-medium tracking-tight">{f.title}</h3>
                                        <p className="text-[14px] leading-relaxed text-ink-soft">{f.body}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials / Loved by */}
            <section id="loved" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
                <Reveal>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        05 / loved by
                    </div>
                    <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                        <h2 className="max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                            Quiet software,{" "}
                            <span className="font-editorial italic">loud opinions</span>.
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-ember text-ember" />
                                ))}
                            </div>
                            <span className="font-mono text-[11px] text-ink-soft">4.9 / 5 · 820 reviews</span>
                        </div>
                    </div>
                </Reveal>

                <div className="grid gap-5 md:grid-cols-2">
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={(i % 2) * 0.08}>
                            <figure className="group relative h-full rounded-2xl border border-rule bg-paper p-7 transition-all hover:-translate-y-1 hover:border-ember/40 hover:shadow-[0_20px_40px_-24px_rgba(28,25,23,0.25)] sm:p-8">
                                <Quote className="absolute right-6 top-6 h-5 w-5 text-ember/50" />
                                <blockquote className="font-editorial text-[19px] leading-[1.55] text-ink">
                                    "{t.quote}"
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-3 border-t border-rule pt-5">
                                    <div className="grid h-9 w-9 place-items-center rounded-full bg-ink font-mono text-[11px] font-medium text-paper">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-medium text-ink">{t.name}</div>
                                        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                            {t.role}
                                        </div>
                                    </div>
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Feedback / share your thoughts */}
            <section id="feedback" className="border-y border-rule bg-paper-2/40 py-20 sm:py-28">
                <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
                    <Reveal>
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            06 / your turn
                        </div>
                        <h2 className="mb-4 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                            Tell us what's{" "}
                            <span className="font-editorial italic">missing</span>.
                        </h2>
                        <p className="max-w-md text-ink-soft">
                            ZipNotes is shaped by the people who use it daily. Every note in our inbox gets
                            read — most get a reply within a day.
                        </p>
                        <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-rule bg-rule">
                            {[
                                { v: "1.2k", l: "ideas shipped" },
                                { v: "94%", l: "reply rate" },
                                { v: "<24h", l: "response time" },
                            ].map((s) => (
                                <div key={s.l} className="bg-paper px-4 py-5">
                                    <div className="font-display text-xl font-medium text-ink">{s.v}</div>
                                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <FeedbackForm />
                    </Reveal>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28">
                <Reveal>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                        07 / faq
                    </div>
                    <h2 className="mb-10 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                        Questions, <span className="font-editorial italic">answered</span>.
                    </h2>
                </Reveal>

                <Reveal delay={0.05}>
                    <div className="overflow-hidden rounded-2xl border border-rule bg-paper">
                        {FAQS.map((item, i) => {
                            const open = openFaq === i;
                            return (
                                <div key={item.q} className={i > 0 ? "border-t border-rule" : ""}>
                                    <button
                                        onClick={() => setOpenFaq(open ? -1 : i)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-paper-2/50 sm:px-6"
                                    >
                                        <span className="font-medium text-ink">{item.q}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 ${open ? "rotate-180 text-ember" : ""
                                                }`}
                                        />
                                    </button>
                                    <div
                                        className="grid overflow-hidden transition-all duration-300 ease-out"
                                        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                                    >
                                        <div className="min-h-0 overflow-hidden">
                                            <p className="px-5 pb-5 text-[14px] leading-relaxed text-ink-soft sm:px-6">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </section>

            {/* CTA */}
            <section className="border-t border-rule bg-paper-2/40">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
                    <Reveal>
                        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            08 / one page. type.
                        </div>
                        <h2 className="mb-6 font-display text-3xl font-medium tracking-[-0.03em] sm:text-[2.75rem]">
                            Stop fighting your{" "}
                            <span className="font-editorial italic">note app</span>.
                        </h2>
                        <p className="mx-auto mb-9 max-w-md text-[15px] text-ink-soft">
                            Free forever for the core notepad. No credit card, no onboarding tour.
                        </p>
                        <Link
                            href="/sign-up"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            Create your account
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-rule bg-paper">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <Logo small />
                    <div className="font-mono text-[11px] text-ink-muted">
                        © 2026 ZipNotes · made small on purpose
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeedbackForm() {
    const [sent, setSent] = useState(false);
    const [rating, setRating] = useState(0);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
            }}
            className="relative rounded-2xl border border-rule bg-paper p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_30px_60px_-40px_rgba(28,25,23,0.25)] sm:p-8"
        >
            <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    feedback.send
                </span>
                <span className="font-mono text-[10px] text-ember">draft</span>
            </div>

            <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    How does it feel so far?
                </span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onMouseEnter={() => setRating(n)}
                            onClick={() => setRating(n)}
                            className="p-1 transition-transform hover:scale-110"
                            aria-label={`Rate ${n}`}
                        >
                            <Star
                                className={`h-5 w-5 transition-colors ${n <= rating ? "fill-ember text-ember" : "text-ink-muted/40"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </label>

            <label className="mt-5 block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    Email (optional)
                </span>
                <input
                    type="email"
                    placeholder="you@work.com"
                    className="w-full rounded-xl border border-rule bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted/70 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/15"
                />
            </label>

            <label className="mt-4 block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    What would make it better?
                </span>
                <textarea
                    rows={4}
                    required
                    placeholder="The one thing I wish ZipNotes did differently is…"
                    className="w-full resize-none rounded-xl border border-rule bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted/70 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/15"
                />
            </label>

            <button
                type="submit"
                disabled={sent}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft disabled:opacity-70"
            >
                {sent ? "Thank you — we'll read every word." : "Send feedback"}
                {!sent && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
        </form>
    );
}