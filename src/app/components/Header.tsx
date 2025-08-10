"use client";
import React, { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Github, Coffee, Menu, X } from "lucide-react";
import { SupportModal } from "./SupportModal";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    return (
        <header className={`nav${isMenuOpen ? " is-open" : ""}`}>
            <div className="brand">
                <div className="logo" aria-hidden="true"></div>
                <h1>Pydantic → TypeScript Converter</h1>
            </div>
            <button
                type="button"
                className="nav-toggle"
                aria-label="Toggle navigation menu"
                aria-controls="primary-nav"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
            >
                {isMenuOpen ? (
                    <X aria-hidden="true" />
                ) : (
                    <Menu aria-hidden="true" />
                )}
                <span className="sr-only">Menu</span>
            </button>
            <div className="nav-actions" id="primary-nav">
                <span className="badge" title="Client-side only">
                    <span
                        className="dot"
                        style={{ width: 8, height: 8, borderRadius: 9999 }}
                        aria-hidden
                    ></span>
                    Private & Client‑Side
                </span>
                <ThemeToggle />
                <a
                    className="btn"
                    href="https://github.com/sushpawar001/pydantic-typescript-converter"
                    target="_blank"
                >
                    <Github aria-hidden="true" />
                    <span>GitHub</span>
                </a>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsSupportOpen(true)}
                >
                    <Coffee aria-hidden="true" />
                    <span>Buy me a coffee</span>
                </button>
            </div>
            <SupportModal
                open={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />
        </header>
    );
}
