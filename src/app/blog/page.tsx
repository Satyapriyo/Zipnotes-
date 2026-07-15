"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
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

type Post = {
    n: string;
    category: string;
    title: string;
    dek: string;
    author: string;
    date: string;
    read: string;
    body: string[];
};

const FEATURED: Post = {
    n: "01",
    category: "manifesto",
    title: "The case for note apps that do less",
    dek: "Every productivity tool eventually grows a database, a board, and a wiki. We think that's the bug — not the feature.",
    author: "The ZipNotes team",
    date: "Jun 29, 2026",
    read: "6 min",
    body: [
        "Somewhere between 2015 and 2020, note apps stopped being note apps. They grew databases. They grew boards. They grew wikis, embeds, and \"AI copilots\" that summarize what you just wrote back at you. Somewhere in there, the actual note — the small, quick thought you wanted to capture before it evaporated — got harder and harder to reach.",
        "ZipNotes is a bet that most of us don't need a workspace. We need a page. One page. One that opens in under half a second, saves itself, and follows us to whatever device we're on. That's it.",
        "The trade-offs are real. You can't build a company wiki in ZipNotes. You can't run your kanban board here. You can't @-mention your coworker inside a comment thread nested three databases deep. If any of that sounds like a downgrade, ZipNotes probably isn't for you — and that's fine.",
        "But if you've ever closed your note app to open a text file instead, this is for you.",
    ],
};

const POSTS: Post[] = [
    {
        n: "02",
        category: "field guide",
        title: "How to write more by owning fewer apps",
        dek: "A quiet argument for the one-app writing setup — and a template you can steal.",
        author: "Ines G.",
        date: "Jun 22, 2026",
        read: "5 min",
        body: [
            "The most prolific writers we know use one editor. Not one \"main\" editor with a backup — one, full stop. Choosing where to write is friction; owning one place eliminates it.",
            "Pick the plainest tool you'll tolerate. Everything else — the outlines, the drafts, the fragments — lives inside it. Search replaces folders. Titles replace tags. You'll write more the same week you switch.",
        ],
    },
    {
        n: "03",
        category: "engineering",
        title: "How ZipNotes cold-starts in under 400ms",
        dek: "A tour of the choices that made the app feel instant on locked-down laptops.",
        author: "Hiro T.",
        date: "Jun 15, 2026",
        read: "8 min",
        body: [
            "Cold start is a budget problem. We had 400 milliseconds to go from a blank tab to a blinking cursor on a mid-range laptop with an aggressive corporate proxy in the way. That budget shaped every technical decision.",
            "We ship a 2.4 MB bundle, defer everything not needed for the first keystroke, and pre-warm the editor with an inline skeleton so the caret is on screen before the app finishes hydrating. The result feels less like a webapp and more like a native window.",
        ],
    },
    {
        n: "04",
        category: "workflows",
        title: "Note-taking for people whose IT blocks everything",
        dek: "If your workplace treats Notion like a security incident, this one's for you.",
        author: "Daniel R.",
        date: "Jun 08, 2026",
        read: "4 min",
        body: [
            "Half of our earliest users found ZipNotes because their IT team blocked the app they used to love. Restrictive networks aren't a bug in your company — they're the reality for legal teams, banks, hospitals, and most public-sector work.",
            "Small, fast, plain-text tools slip through where heavyweight SaaS gets flagged. That's not a marketing pitch; it's just what firewalls tend to allow.",
        ],
    },
    {
        n: "05",
        category: "opinion",
        title: "Against second brains",
        dek: "Why the metaphor is a trap — and what quietly works better.",
        author: "Maya O.",
        date: "May 30, 2026",
        read: "7 min",
        body: [
            "The \"second brain\" trend sold a lot of subscriptions and left a lot of people with beautifully organized archives they never open. The system became the hobby; the writing stopped.",
            "A first brain is enough. Notes are for the moment of capture, not the fantasy of retrieval. Write it down, then let most of it fade — the important stuff resurfaces on its own.",
        ],
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-paper text-ink">
            <nav className="sticky top-0 z-50 border-b border-rule/70 bg-paper/80 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
                    <Logo />
                    <div className="hidden items-center gap-7 md:flex">
                        <Link href="/" className="text-[13px] text-ink-soft hover:text-ink">Home</Link>
                        <Link href="/pricing" className="text-[13px] text-ink-soft hover:text-ink">Pricing</Link>
                        <Link href="/compare" className="text-[13px] text-ink-soft hover:text-ink">Compare</Link>
                        <Link href="/blog" className="text-[13px] font-medium text-ink">Blog</Link>
                    </div>
                    <Link
                        href="/sign-up"
                        className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-mono text-[12px] font-medium text-paper hover:bg-ink-soft"
                    >
                        Start free <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink-soft"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                    field notes · writing about writing
                </motion.div>
                <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[3.75rem]">
                    Small essays on{" "}
                    <span className="font-editorial italic text-ember">small software.</span>
                </h1>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
                    Notes on note-taking, focus, restricted networks, and the quiet case for building
                    less. Written by the people who make ZipNotes.
                </p>
            </header>

            {/* Featured post */}
            <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24">
                <Reveal>
                    <motion.article
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.3, ease }}
                        className="group relative overflow-hidden rounded-3xl border border-rule bg-paper-2/60 p-8 sm:p-12"
                    >
                        <div className="pointer-events-none absolute -right-8 -top-8 font-editorial text-[12rem] leading-none text-ink/[0.05]">
                            {FEATURED.n}
                        </div>
                        <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
                            <span className="rounded-full bg-ember px-2 py-0.5 text-paper">featured</span>
                            <span className="text-ink-muted">{FEATURED.category}</span>
                            <span className="text-ink-muted">·</span>
                            <span className="inline-flex items-center gap-1 text-ink-muted">
                                <Clock className="h-3 w-3" /> {FEATURED.read}
                            </span>
                        </div>
                        <h2 className="max-w-2xl font-display text-3xl font-medium tracking-tight text-ink sm:text-[2.5rem]">
                            {FEATURED.title}
                        </h2>
                        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft">{FEATURED.dek}</p>

                        <div className="mt-6 space-y-4 border-t border-rule pt-6 font-editorial text-[17px] leading-[1.7] text-ink">
                            {FEATURED.body.slice(0, 2).map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5">
                            <div className="flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                                    ZN
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-ink">{FEATURED.author}</div>
                                    <div className="font-mono text-[10px] text-ink-muted">{FEATURED.date}</div>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ember-ink group-hover:text-ember">
                                read the full essay <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                        </div>
                    </motion.article>
                </Reveal>
            </section>

            {/* Post list */}
            <section className="border-t border-rule bg-paper-2/40 py-20 sm:py-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <Reveal>
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            02 / archive
                        </div>
                        <h2 className="mb-12 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                            Every post, <span className="font-editorial italic">so far</span>.
                        </h2>
                    </Reveal>

                    <div className="divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper">
                        {POSTS.map((p, i) => (
                            <Reveal key={p.n} delay={i * 0.05}>
                                <motion.article
                                    whileHover={{ backgroundColor: "rgb(0 0 0 / 0.015)" }}
                                    className="group grid grid-cols-[auto_1fr_auto] items-start gap-5 px-6 py-7 transition-colors sm:gap-8 sm:px-10 sm:py-9"
                                >
                                    <div className="font-editorial text-3xl leading-none text-ember/70 sm:text-4xl">
                                        {p.n}
                                    </div>
                                    <div>
                                        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                                            <span>{p.category}</span>
                                            <span>·</span>
                                            <span>{p.date}</span>
                                            <span>·</span>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {p.read}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-ember-ink sm:text-2xl">
                                            {p.title}
                                        </h3>
                                        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">{p.dek}</p>
                                        <div className="mt-4 space-y-3 font-editorial text-[15px] leading-[1.7] text-ink/85">
                                            {p.body.map((para, j) => (
                                                <p key={j}>{para}</p>
                                            ))}
                                        </div>
                                        <div className="mt-5 flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                                            <span className="grid h-5 w-5 place-items-center rounded-full bg-paper-2 text-[9px] text-ink">
                                                {p.author
                                                    .split(" ")
                                                    .map((w) => w[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </span>
                                            {p.author}
                                        </div>
                                    </div>
                                    <ArrowUpRight className="mt-2 h-5 w-5 text-ink-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
                                </motion.article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscribe / CTA */}
            <section className="border-t border-rule bg-paper">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 md:grid-cols-2 md:gap-16">
                    <Reveal>
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ember-ink">
                            03 / the mailing list
                        </div>
                        <h2 className="mb-4 font-display text-3xl font-medium tracking-tight sm:text-[2.5rem]">
                            One essay a month.{" "}
                            <span className="font-editorial italic">No pitches.</span>
                        </h2>
                        <p className="max-w-md text-ink-soft">
                            A short, thoughtful email on the first of every month. Unsubscribe with one
                            click. Never sold, never shared.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="rounded-2xl border border-rule bg-paper-2/60 p-6 sm:p-8"
                        >
                            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                                your email
                            </label>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    placeholder="you@work.com"
                                    className="flex-1 rounded-xl border border-rule bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted/70 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/15"
                                />
                                <button
                                    type="submit"
                                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-all hover:translate-y-[-1px] hover:bg-ink-soft"
                                >
                                    Subscribe
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </div>
                            <p className="mt-4 font-mono text-[11px] text-ink-muted">
                                1,240 readers · monthly · zero tracking pixels
                            </p>
                        </form>
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