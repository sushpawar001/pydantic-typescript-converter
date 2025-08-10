"use client";

import { Globe, IndianRupee, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type SupportModalProps = {
    open: boolean;
    onClose: () => void;
};

export function SupportModal({ open, onClose }: SupportModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) {
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
        }
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-title"
            aria-describedby="support-desc"
        >
            {/* Backdrop */}
            <div
                className="modal-backdrop absolute inset-0"
                onClick={onClose}
            />

            {/* Modal card */}
            <div className="modal-card relative z-10 w-full max-w-lg rounded-2xl p-5 shadow-2xl">
                <button
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)]/80 bg-white/5 text-[var(--text)]/90 transition hover:bg-white/10"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="mb-3 pr-10">
                    <h2
                        id="support-title"
                        className="m-0 text-xl font-extrabold tracking-tight text-[var(--text)]"
                    >
                        Buy me a coffee
                    </h2>
                    <p
                        id="support-desc"
                        className="mt-1 text-sm text-[var(--text)] opacity-90"
                    >
                        If this saved you time, fuel more dev with a coffee.
                        Thank you!
                    </p>
                </div>

                <div className="grid gap-3">
                    <Link
                        href="https://buymeacoffee.com/sushpawar"
                        target="_blank"
                    >
                        <button className="group w-full rounded-xl border border-[color:var(--border)] bg-[var(--bg)]/40 px-4 py-3 text-left transition hover:border-white/30 hover:bg-[var(--bg)]/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-lg bg-white/15 p-1.5 text-[var(--text)]">
                                    <Globe
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-[var(--text)]">
                                        International
                                    </div>
                                    <div className="text-xs text-[var(--text)] opacity-80">
                                        Card or Stripe checkout
                                    </div>
                                </div>
                            </div>
                        </button>
                    </Link>

                    <Link
                        href="https://onlychai.neocities.org/support.html?name=Sushant%20Pawar&upi=fitnation1000%40oksbi"
                        target="_blank"
                    >
                        <button className="group w-full rounded-xl border border-[color:var(--border)] bg-[var(--bg)]/40 px-4 py-3 text-left transition hover:border-white/30 hover:bg-[var(--bg)]/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-lg bg-white/15 p-1.5 text-[var(--text)]">
                                    <IndianRupee
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[var(--text)]">
                                            India
                                        </span>
                                        <span className="badge-upi rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                                            UPI supported
                                        </span>
                                    </div>
                                    <div className="text-xs text-[var(--text)] opacity-80">
                                        Pay with any UPI app
                                    </div>
                                </div>
                            </div>
                        </button>
                    </Link>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        className="rounded-lg border border-[color:var(--border)] bg-white/5 px-3 py-2 text-sm font-semibold text-[var(--text)] hover:border-white/30 hover:bg-white/10"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
