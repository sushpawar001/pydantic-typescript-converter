import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { blogList } from "./posts";

export const metadata: Metadata = {
    title: "Blog – Pydantic to TypeScript Converter",
    description:
        "Guides for mapping Pydantic models, enums, literals, optionals, and collections to accurate TypeScript types.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog – Pydantic to TypeScript Converter",
        description:
            "Guides for mapping Pydantic models, enums, literals, optionals, and collections to accurate TypeScript types.",
        url: "/blog",
    },
};

export default function BlogIndexPage() {
    return (
        <div className="page">
            <Header />

            <section className="blog-hero">
                <p className="kicker">Blog</p>
                <h1 className="title">Pydantic → TypeScript guides</h1>
                <p className="subtitle">
                    Fast walkthroughs on keeping Python and TypeScript contracts
                    in sync: optionals and unions, enums to string unions, and
                    BaseModels to interfaces.
                </p>
                <div className="actions">
                    <Link className="btn btn-primary" href="/">
                        Use the converter
                    </Link>
                    <Link className="btn" href="/#features">
                        See features
                    </Link>
                </div>
            </section>

            <section className="blog-related" style={{ marginTop: 30 }}>
                <h3>All posts</h3>
                <div className="blog-related-grid">
                    {blogList.map((item) => (
                        <Link key={item.slug} href={item.slug} className="blog-card">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                            <p style={{ marginTop: 6, fontWeight: 700 }}>{item.readTime}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

