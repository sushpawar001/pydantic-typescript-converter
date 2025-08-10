"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { Prism } from "@/lib/syntax";

export function OutputViewer({ code }: { code: string }) {
    const codeRef = useRef<HTMLElement | null>(null);

    const highlighted = useMemo(() => {
        const source = code?.trim()
            ? code
            : "Your TypeScript types will appear here.";
        return Prism.highlight(
            source,
            Prism.languages.typescript,
            "typescript"
        );
    }, [code]);

    useEffect(() => {
        if (codeRef.current) {
            // Non-interactive: just set highlighted HTML
            codeRef.current.innerHTML = highlighted;
        }
    }, [highlighted]);

    return (
        <div
            role="region"
            aria-label="TypeScript output"
            data-testid="ts-output"
            className="w-full"
        >
            <pre className="codeblock overflow-auto" aria-live="polite">
                <code ref={codeRef} className="language-ts" />
            </pre>
        </div>
    );
}
