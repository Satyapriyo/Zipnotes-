import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing — ZipNotes · Free forever, Pro under five dollars",
    description:
        "Simple, transparent pricing for ZipNotes. Free forever for the core notepad. Pro at $4/month with team spaces and long version history.",
    openGraph: {
        title: "ZipNotes pricing — free forever, Pro under $5",
        description:
            "Free forever. Pro at $4/month. No credit card, no onboarding tour, no surprise line items.",
        url: "/pricing",
        type: "website",
    },
    alternates: {
        canonical: "/pricing",
    },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: "ZipNotes",
                        description: "A featherweight cloud-synced notepad for focused work.",
                        offers: [
                            { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
                            { "@type": "Offer", name: "Pro", price: "4", priceCurrency: "USD" },
                            { "@type": "Offer", name: "Team", price: "9", priceCurrency: "USD" },
                        ],
                    }),
                }}
            />
            {children}
        </>
    );
}