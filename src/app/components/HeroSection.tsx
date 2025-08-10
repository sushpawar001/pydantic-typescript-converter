import React from "react";

export function HeroSection() {
    return (
        <section className="hero">
            <span className="kicker">Pydantic To TypeScript Converter</span>
            <h2 className="title">
                Turn Pydantic models into{" "}
                <span className="grad">production‑ready TypeScript</span>
            </h2>
            <p className="subtitle">
                Instant, accurate TS types—right in your browser. No uploads.
                Supports Optional, Union, Literal, Enums, nested models, and
                naming strategies.
            </p>
            {/* <div className="cta-row">
                <a className="btn btn-primary" href="#convert">
                    Convert Now
                </a>
                <a className="btn" href="#example">
                    See Example
                </a>
                <span className="mini">
                    <span className="dot"></span> Private & Client‑Side
                </span>
            </div> */}
        </section>
    );
}
