"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
    validateAndParsePythonSource,
    hasCriticalErrors,
} from "@/lib/validation/validateInput";
import { emitDeclarations } from "@/lib/converter/tsEmit";
import { ValidationAlert } from "./ValidationAlert";
import { InputEditor } from "./InputEditor";
import { OutputViewer } from "./OutputViewer";
import { ActionsBar } from "./ActionsBar";
import { FileCode2 } from "lucide-react";

const EXAMPLE = `from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime

class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Profile(BaseModel):
    bio: Optional[str] = None
    website: Optional[str] = None

class User(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    status: Status = Status.ACTIVE
    tags: List[str] = []
    created_at: datetime
    profile: Optional[Profile] = None
`;

export function ConversionClient() {
    const [src, setSrc] = useState("");
    const [debouncedSrc, setDebouncedSrc] = useState("");

    useEffect(() => {
        const h = window.setTimeout(() => setDebouncedSrc(src), 150);
        return () => window.clearTimeout(h);
    }, [src]);

    const { tsCode, diagnostics } = useMemo(() => {
        const { declarations, diagnostics } =
            validateAndParsePythonSource(debouncedSrc);
        const ts = emitDeclarations(declarations);
        return { tsCode: ts, diagnostics };
    }, [debouncedSrc]);

    const disabled = hasCriticalErrors(diagnostics) || tsCode.trim() === "";

    return (
        <>
            <ValidationAlert diagnostics={diagnostics} />
            <section className="panel" id="convert">
                <div className="panel-inner">
                    <article className="card">
                        <div className="card-header">
                            <h3 id="example">Pydantic Models</h3>
                            <div className="actions">
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setSrc(EXAMPLE)}
                                >
                                    <FileCode2 aria-hidden="true" />
                                    <span>See Example</span>
                                </button>
                            </div>
                        </div>
                        <InputEditor value={src} onChange={setSrc} />
                    </article>

                    <article className="card">
                        <div className="card-header">
                            <h3>TypeScript Types</h3>
                            <div className="actions">
                                <ActionsBar
                                    tsCode={tsCode}
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                        <OutputViewer code={tsCode} />
                    </article>
                </div>
            </section>
        </>
    );
}
