import React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Link from "next/link";

export default function NotFound() {
    return (
        <div
            className="page"
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100dvh",
                paddingBottom: 24,
                paddingTop: 16,
                overflow: "hidden",
            }}
        >
            <Header />
            <main style={{ flex: 1, display: "grid", placeItems: "center" }}>
                <section className="hero">
                    <span className="kicker">404 — Page not found</span>
                    <h2 className="title">We couldn&apos;t find that page</h2>
                    <p className="subtitle">
                        The link might be broken or the page may have been
                        moved.
                    </p>
                    <div className="inline-flex gap-1.5 md:gap-3 justify-center flex-wrap">
                        <Link className="btn btn-primary" href="/">
                            Go back home
                        </Link>
                        <a
                            className="btn"
                            href="https://github.com/sushpawar001/pydantic-typescript-converter/issues/new"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Report an issue
                        </a>
                    </div>
                </section>
            </main>
            <Footer style={{ marginTop: 0 }} />
        </div>
    );
}
