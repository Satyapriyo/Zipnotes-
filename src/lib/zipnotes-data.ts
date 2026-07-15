// Static mock data for the ZipNotes UI shells.

export const STATS = [
  { value: "0.4s", label: "Cold start", sub: "blank page to typing" },
  { value: "2.4MB", label: "Install size", sub: "smaller than a photo" },
  { value: "12k+", label: "Writers", sub: "across 64 countries" },
  { value: "99.99%", label: "Uptime", sub: "last twelve months" },
];

export const FOOTPRINT = [
  { name: "ZipNotes", size: "2.4 MB", load: "0.4s", pct: 4, accent: true },
  {
    name: "All-in-one workspace suite",
    size: "~210 MB",
    load: "7–12s",
    pct: 96,
    accent: false,
  },
  {
    name: "Legacy note app + sync client",
    size: "~85 MB",
    load: "3–5s",
    pct: 52,
    accent: false,
  },
];

export const DIFF_LINES: { type: "minus" | "plus"; text: string }[] = [
  {
    type: "minus",
    text: "Often blocked by corporate firewalls and content filters",
  },
  { type: "plus", text: "Loads as one small request — rarely flagged by IT" },
  { type: "minus", text: "$8–15/month just to sync notes across devices" },
  { type: "plus", text: "Simple, transparent pricing — under five dollars" },
  { type: "minus", text: "Wikis, databases, and boards you'll never open" },
  { type: "plus", text: "One page. Type. It saves itself" },
  { type: "minus", text: "5–10 second cold start on a locked-down laptop" },
  { type: "plus", text: "Opens to a blank page in under half a second" },
];

export const TESTIMONIALS = [
  {
    quote:
      "I've been waiting years for a notes app that doesn't try to be a project manager. ZipNotes opens before my coffee is ready.",
    name: "Maya Okafor",
    role: "Staff engineer, Lattice",
    initials: "MO",
  },
  {
    quote:
      "Our security team blocks almost every productivity SaaS on the market. ZipNotes was the only one that just worked on day one.",
    name: "Daniel Reyes",
    role: "Counsel, Aperture Legal",
    initials: "DR",
  },
  {
    quote:
      "It feels like a real notebook — quiet, fast, and out of the way. I write more because there's nothing to set up.",
    name: "Inés García",
    role: "Independent writer",
    initials: "IG",
  },
  {
    quote:
      "Replaced a tool that cost the team $12 a seat. Nobody noticed, and onboarding went from a week to a minute.",
    name: "Hiro Tanaka",
    role: "Ops lead, Northwind",
    initials: "HT",
  },
];

export const WORKFLOW = [
  {
    step: "01",
    title: "Open it",
    body: "One page opens instantly — no workspaces, no project setup, nothing to name.",
  },
  {
    step: "02",
    title: "Write it",
    body: "Type the way you think. Headings, lists, links — quietly formatted, never in the way.",
  },
  {
    step: "03",
    title: "Forget it",
    body: "Every keystroke syncs to the cloud. Close the tab and your work picks up anywhere.",
  },
];

export const FAQS = [
  {
    q: "Is there a free plan?",
    a: "Yes. The core notepad — unlimited notes, cloud sync, every device — is free, forever. Paid tiers add team workspaces and longer version history.",
  },
  {
    q: "Why does this get through firewalls that block other apps?",
    a: "Big workspace platforms bundle file storage, embeds, and trackers that trip security filters. ZipNotes is just a small, text-based app — far less for a firewall to flag.",
  },
  {
    q: "Are my notes backed up anywhere?",
    a: "Yes — everything saves to the cloud automatically and stays in sync across every device you're signed into. Local copies are kept on each device for offline use.",
  },
  {
    q: "Can I export my notes?",
    a: "Anytime, in plain Markdown. Your work is yours; there is no proprietary format and no lock-in.",
  },
];

export type Note = {
  id: string;
  title: string;
  preview: string;
  words: number;
  updatedAt: string;
};

export const NOTES: Note[] = [
  {
    id: "n1",
    title: "Q4 roadmap — quiet ship list",
    preview:
      "Three things that have to land before December. Sync conflict resolution, mobile cold-start under 400ms, export to Markdown. Everything else moves to Q1.",
    words: 312,
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "n2",
    title: "Conversation w/ Maya",
    preview:
      "She mentioned the procurement team is the real blocker — not IT. They sign every SaaS over $40. Pitch the under-$5 angle when we ship pricing.",
    words: 188,
    updatedAt: "2026-06-28T09:11:00Z",
  },
  {
    id: "n3",
    title: "weeknotes / w26",
    preview:
      "Quiet week. Shipped the editor refactor, finally killed the legacy autosave queue. Started reading Pollan's new one. Coffee experiments: 18g in, 36g out, 28s.",
    words: 540,
    updatedAt: "2026-06-27T19:40:00Z",
  },
  {
    id: "n4",
    title: "Idea: tiny status page",
    preview:
      "A single text file that becomes a public page. No dashboards, no metrics — just whatever you wrote last. Could be a weekend project.",
    words: 96,
    updatedAt: "2026-06-26T22:05:00Z",
  },
  {
    id: "n5",
    title: "Travel — Lisbon notes",
    preview:
      "Stay in Príncipe Real, not Baixa. Tram 28 only at 7am. Belém is a half-day max. Manteigaria > Pastéis de Belém, controversially.",
    words: 224,
    updatedAt: "2026-06-25T08:30:00Z",
  },
  {
    id: "n6",
    title: "interview prep / staff role",
    preview:
      "Three stories: the migration that didn't ship, the hire I almost lost, the doc that changed the team. Keep each under three minutes.",
    words: 410,
    updatedAt: "2026-06-24T16:50:00Z",
  },
  {
    id: "n7",
    title: "books to finish",
    preview:
      "Annie Dillard — Pilgrim. Robin Sloan — Moonbound. Re-read Bird by Bird. Stop starting new ones.",
    words: 42,
    updatedAt: "2026-06-23T11:20:00Z",
  },
  {
    id: "n8",
    title: "Apartment — paint swatches",
    preview:
      "Bedroom: Farrow & Ball School House White. Living: Setting Plaster. Kitchen stays. Test in morning light before committing.",
    words: 78,
    updatedAt: "2026-06-22T07:15:00Z",
  },
];

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export const TASKS_BY_CATEGORY: Record<string, Task[]> = {
  today: [
    {
      id: "t1",
      title: "Review the Q4 roadmap one more time",
      completed: false,
      createdAt: "2026-06-29T07:00:00Z",
    },
    {
      id: "t2",
      title: "Reply to Maya about procurement",
      completed: false,
      createdAt: "2026-06-29T07:05:00Z",
    },
    {
      id: "t3",
      title: "Buy coffee beans",
      completed: true,
      createdAt: "2026-06-29T06:30:00Z",
    },
    {
      id: "t4",
      title: "Walk before the 2pm meeting",
      completed: false,
      createdAt: "2026-06-29T08:00:00Z",
    },
  ],
  weekly: [
    {
      id: "t5",
      title: "Ship editor cold-start fix",
      completed: false,
      createdAt: "2026-06-27T09:00:00Z",
    },
    {
      id: "t6",
      title: "Draft pricing page v2",
      completed: false,
      createdAt: "2026-06-26T09:00:00Z",
    },
    {
      id: "t7",
      title: "1:1 with each direct report",
      completed: true,
      createdAt: "2026-06-25T09:00:00Z",
    },
    {
      id: "t8",
      title: "Finalize Lisbon flights",
      completed: false,
      createdAt: "2026-06-25T09:00:00Z",
    },
  ],
  "long-term": [
    {
      id: "t9",
      title: "Hit 1,000 signups",
      completed: false,
      createdAt: "2026-06-01T09:00:00Z",
    },
    {
      id: "t10",
      title: "Publish the 'small software' essay",
      completed: false,
      createdAt: "2026-05-20T09:00:00Z",
    },
    {
      id: "t11",
      title: "Learn enough Portuguese to order coffee",
      completed: false,
      createdAt: "2026-05-10T09:00:00Z",
    },
    {
      id: "t12",
      title: "Run a half marathon",
      completed: false,
      createdAt: "2026-04-15T09:00:00Z",
    },
  ],
};

export const CATEGORY_META = {
  today: { title: "Today", desc: "What needs to get done today." },
  weekly: {
    title: "This week",
    desc: "Your priorities for the next seven days.",
  },
  "long-term": {
    title: "Long-term",
    desc: "Big-picture objectives and milestones.",
  },
} as const;

export function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
