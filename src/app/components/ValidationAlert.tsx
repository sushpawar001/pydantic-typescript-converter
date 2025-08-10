"use client";
import React from "react";
import type { Diagnostic } from "@/lib/ir/diagnostics";

export function ValidationAlert({
    diagnostics,
}: {
    diagnostics: Diagnostic[];
}) {
    if (!diagnostics.length) return null;
    return (
        <div
            role="alert"
            className="w-full rounded-md border border-amber-400/40 bg-amber-400/10 p-3"
        >
            <ul className="list-disc pl-5 text-sm">
                {diagnostics.map((d, idx) => (
                    <li key={idx} className="leading-6">
                        <strong className="uppercase mr-1">{d.severity}</strong>
                        {d.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}
