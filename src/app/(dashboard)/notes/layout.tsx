import type { Metadata } from "next";

const CATEGORY_META = {
    today: { title: "Today's Tasks", desc: "What needs to get done today?" },
    weekly: { title: "Weekly Tasks", desc: "Your priorities for this week." },
    "long-term": { title: "Long-Term Goals", desc: "Big picture objectives and milestones." },
};

type Props = {
    params: { category: string };
};

// Dynamically generate the page title based on the URL parameter
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = params.category;

    const meta = CATEGORY_META[category as keyof typeof CATEGORY_META] ?? {
        title: "Tasks",
        desc: "Manage your tasks.",
    };

    return {
        title: `${meta.title} — ZipNotes`,
        description: meta.desc,
    };
}

export default function TasksLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}