import Link from "next/link";

export function Logo({ small = false }: { small?: boolean }) {
    return (
        <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="relative grid h-7 w-7 place-items-center rounded-md bg-ink text-paper transition-transform duration-300 group-hover:rotate-[-4deg] dark:bg-paper dark:text-ink">
                <span className="font-mono text-[13px] font-bold leading-none">z</span>
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                ZipNotes
            </span>
            {!small && (
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted sm:inline">
                    / notepad
                </span>
            )}
        </Link>
    );
}
