export type DiagnosticSeverity = "error" | "warning" | "info";

export interface Position {
    offset: number; // zero-based character offset
    line: number; // one-based line number
    column: number; // one-based column number
}

export interface Range {
    start: Position;
    end: Position;
}

export interface Diagnostic {
    severity: DiagnosticSeverity;
    message: string;
    range: Range;
    code?: string;
}
