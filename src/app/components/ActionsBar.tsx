"use client";
import React, { useState } from "react";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import { downloadTextFile } from "@/lib/utils/downloadFile";
import { Copy, Download } from "lucide-react";

export function ActionsBar({
    tsCode,
    disabled,
}: {
    tsCode: string;
    disabled: boolean;
}) {
    const [status, setStatus] = useState<string>("");
    return (
        <div className="flex gap-2 items-center">
            <button
                className="btn btn-sm disabled:opacity-50"
                onClick={async () => {
                    const ok = await copyToClipboard(tsCode);
                    setStatus(ok ? "Copied" : "Copy failed");
                    setTimeout(() => setStatus(""), 1500);
                }}
                disabled={disabled}
            >
                <Copy aria-hidden="true" />
                <span>Copy</span>
            </button>
            <button
                className="btn btn-sm disabled:opacity-50"
                onClick={() => downloadTextFile("models.ts", tsCode)}
                disabled={disabled}
            >
                <Download aria-hidden="true" />
                <span>Download</span>
            </button>
            <span className="text-xs opacity-70">{status}</span>
        </div>
    );
}
