import type { Metadata } from "next";
import { Sen, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

// Determine the site's base URL from environment variables
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const sen = Sen({
    variable: "--font-heading",
    subsets: ["latin"],
    weight: ["600", "700", "800"],
    display: "swap",
});

const nunitoSans = Nunito_Sans({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
    title: "Pydantic to TypeScript Converter – Instant, Accurate TS Types",
    description:
        "Convert Pydantic models to TypeScript in seconds. Paste your Python models and get precise TS interfaces/types for React, Next.js, and frontend apps. Private, fast, and free.",
    keywords: [
        "pydantic to typescript converter",
        "convert pydantic models to typescript",
        "pydantic v2 typescript",
        "fastapi typescript types",
        "python to typescript types",
    ],
    alternates: {
        canonical: "/",
    },
    icons: {
        icon: "/icon-dark.svg",
    },
    openGraph: {
        title: "Pydantic to TypeScript Converter (Free, Instant)",
        description:
            "Generate accurate TypeScript interfaces from Pydantic models. Runs in your browser—no uploads.",
        url: siteUrl ?? "http://localhost:3000",
        siteName: "Pydantic to TypeScript Converter",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pydantic to TypeScript Converter (Free, Instant)",
        description:
            "Generate accurate TypeScript interfaces from Pydantic models. Runs in your browser—no uploads.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${sen.variable} ${nunitoSans.variable} antialiased`}
            >
                <ThemeProvider>{children}</ThemeProvider>
                {gaId ? (
                    <GoogleAnalytics gaId={gaId} />
                ) : null}
                <Script
                    id="ld-app"
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            name: "Pydantic to TypeScript Converter",
                            applicationCategory: "DeveloperApplication",
                            operatingSystem: "Web",
                            url: siteUrl,
                            description:
                                "Convert Pydantic models to TypeScript in seconds. Private, accurate, and ideal for FastAPI + Next.js workflows.",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "USD",
                            },
                        }),
                    }}
                />
                <Script
                    id="ld-faq"
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: [
                                {
                                    "@type": "Question",
                                    name: "What is a Pydantic to TypeScript converter?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "A tool that generates TypeScript interfaces/types from Pydantic models so frontend apps can share accurate types with Python backends.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Does it support Pydantic v2?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Yes. Common v1 and v2 patterns are supported, including Field, Optional, Union, Literal, and nested models.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Is my code uploaded to a server?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "No. Conversion runs entirely in your browser.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Can I use it with FastAPI models?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Yes. Paste the Pydantic models you use in FastAPI, convert, and import the generated TypeScript in your frontend.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Does it preserve field aliases?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Yes. You can keep aliases as-is or convert output to camelCase.",
                                    },
                                },
                            ],
                        }),
                    }}
                />
            </body>
        </html>
    );
}
