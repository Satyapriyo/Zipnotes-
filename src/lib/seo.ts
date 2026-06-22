import type { Metadata } from "next";

// Single source of truth — update the domain here and it propagates everywhere.
export const siteConfig = {
  name: "ZipNotes",
  domain: "https://zipnotes.online",
  tagline: "Simple cloud notes that work where Notion is blocked",
  title:
    "ZipNotes — Simple Cloud Notes That Work Where Notion Is Blocked",
  description:
    "ZipNotes is a featherweight, cloud-synced notepad built for networks that block Notion and Evernote. No databases, no bloat — open it and write. Free beta, 100 spots.",
  ogImage: "/opengraph-image",
  ogImageAlt: "ZipNotes — lightweight cloud notes that get past IT",
  keywords: [
    "note taking app",
    "lightweight notes",
    "Notion alternative",
    "cloud notes",
    "simple notes app",
    "notes app not blocked at work",
    "notes app for corporate networks",
    "Evernote alternative",
    "fast note app",
    "online notepad",
    "free notes app",
    "ZipNotes",
  ],
  twitterHandle: "@zipnotesonline",
  locale: "en_US",
  themeColor: "#020617",
  icons: {
    favicon: "/favicon.ico",
    icon: "/icon.png",
    apple: "/apple-icon.png",
    svg: "/icon.svg",
    pwa96: "/icon-96.png",
    pwa192: "/icon-192.png",
    pwa512: "/icon-512.png",
  },
} as const;

const ogImageDimensions = { width: 1200, height: 630 };

export const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function absoluteUrl(path = ""): string {
  return path.startsWith("http")
    ? path
    : `${siteConfig.domain}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildOpenGraph(
  title: string,
  description: string,
  url: string
): Metadata["openGraph"] {
  return {
    type: "website",
    locale: siteConfig.locale,
    url,
    siteName: siteConfig.name,
    title,
    description,
    images: [
      {
        url: siteConfig.ogImage,
        ...ogImageDimensions,
        alt: siteConfig.ogImageAlt,
      },
    ],
  };
}

function buildTwitter(
  title: string,
  description: string
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title,
    description,
    images: [siteConfig.ogImage],
  };
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  robots = defaultRobots,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  robots?: Metadata["robots"];
  noIndex?: boolean;
} = {}): Metadata {
  const resolvedTitle = title ?? siteConfig.title;
  const canonical = absoluteUrl(path);

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical },
    openGraph: buildOpenGraph(resolvedTitle, description, canonical),
    twitter: buildTwitter(resolvedTitle, description),
    robots: noIndex ? privateRobots : robots,
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.domain }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: "productivity",
  alternates: {
    canonical: siteConfig.domain,
  },
  openGraph: buildOpenGraph(
    siteConfig.title,
    siteConfig.description,
    siteConfig.domain
  ),
  twitter: buildTwitter(siteConfig.title, siteConfig.description),
  icons: {
    icon: [
      { url: siteConfig.icons.favicon, sizes: "any" },
      { url: siteConfig.icons.icon, sizes: "96x96", type: "image/png" },
      { url: siteConfig.icons.svg, type: "image/svg+xml" },
      { url: siteConfig.icons.pwa192, sizes: "192x192", type: "image/png" },
      { url: siteConfig.icons.pwa512, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: siteConfig.icons.apple, sizes: "180x180", type: "image/png" },
    ],
    shortcut: siteConfig.icons.favicon,
  },
  manifest: "/manifest.json",
  robots: defaultRobots,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.domain,
  description: siteConfig.description,
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: absoluteUrl(siteConfig.icons.pwa512),
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.domain}/notes?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.domain,
  logo: absoluteUrl(siteConfig.icons.pwa512),
  sameAs: [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`],
};

export const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  url: siteConfig.domain,
  description: siteConfig.description,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free during beta. Affordable plans after.",
  },
  featureList: [
    "Cloud sync across devices",
    "Works on corporate and restricted networks",
    "Rich text editor with slash commands",
    "Task lists and to-do checkboxes",
    "Lightweight — under 2.4 MB",
  ],
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ZipNotes really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first 100 beta testers get full access at no cost. After beta, pricing stays simple and affordable — well below Evernote or Notion.",
      },
    },
    {
      "@type": "Question",
      name: "Why does ZipNotes work on corporate networks that block Notion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Notion is a large platform with file sharing and embeds that trip corporate security filters. ZipNotes is a simple, lightweight text app — under 2.4 MB — that rarely gets flagged by firewalls or content filters.",
      },
    },
    {
      "@type": "Question",
      name: "Are my notes synced to the cloud?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — your notes are saved and synced to the cloud automatically, accessible from any device with an internet connection.",
      },
    },
    {
      "@type": "Question",
      name: "How many beta spots are left?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ZipNotes is limited to 100 total beta spots to ensure server stability during testing. Sign up early to secure yours.",
      },
    },
  ],
};
