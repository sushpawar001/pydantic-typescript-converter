"use client";
import React from "react";
import Editor from "react-simple-code-editor";
import { Prism } from "@/lib/syntax";

export function InputEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="w-full">
            <Editor
                value={value}
                onValueChange={onChange}
                highlight={(code) =>
                    Prism.highlight(code, Prism.languages.python, "python")
                }
                padding={16}
                textareaId="python-input"
                className="code-editor rounded-md border border-white/20 focus-within:ring-2 focus-within:ring-white/30"
                aria-label="Python input"
                placeholder="Paste your Pydantic models here…"
                style={{
                    background: "transparent",
                    color: "var(--text)",
                    fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: 13,
                    lineHeight: 1.55,
                    minHeight: 360,
                    // Ensure it can resize similarly to textarea on small screens via CSS breakpoints
                    whiteSpace: "pre",
                }}
            />
        </div>
    );
}
