import type { IrField, IrModel, IrType } from "../ir/ast";
import type { Diagnostic } from "../ir/diagnostics";
import { parseTypeExpression } from "./parseTypes";

export interface ModelParseResult {
    models: IrModel[];
    diagnostics: Diagnostic[];
}

const CLASS_MODEL_RE =
    /^class\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(\s*BaseModel\s*\)\s*:/;

export function parseModelsFromSource(source: string): ModelParseResult {
    const text = source.replace(/\r\n?/g, "\n");
    const lines = text.split("\n");
    const models: IrModel[] = [];
    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        const match = line.match(CLASS_MODEL_RE);
        if (!match) continue;

        const [, className] = match;
        const headerIndent = leadingSpaces(line);
        const fields: IrField[] = [];

        let j = i + 1;
        while (j < lines.length) {
            const ln = lines[j] ?? "";
            const indent = leadingSpaces(ln);
            if (ln.trim() === "") {
                j++;
                continue;
            }
            if (indent <= headerIndent) break;
            const trimmed = ln.trim();
            // skip method/inner class/decorator lines
            if (
                trimmed.startsWith("def ") ||
                trimmed.startsWith("@") ||
                trimmed.startsWith("class ")
            ) {
                j++;
                continue;
            }

            const field = parseFieldLine(trimmed);
            if (field) fields.push(field);
            j++;
        }
        i = j - 1;

        models.push({ kind: "model", name: className, fields });
    }

    return { models, diagnostics };
}

function parseFieldLine(src: string): IrField | null {
    // pattern: name: Type [= default] or name: Type = Field(...)
    const colonIdx = src.indexOf(":");
    if (colonIdx === -1) return null;
    const name = src.slice(0, colonIdx).trim();
    if (!/^[_A-Za-z][_A-Za-z0-9]*$/.test(name)) return null;

    const rest = src.slice(colonIdx + 1).trim();
    // split on '=' if present at top-level (not inside brackets)
    const eqIndex = findTopLevelEquals(rest);
    const typePart = (eqIndex === -1 ? rest : rest.slice(0, eqIndex)).trim();
    const defaultPart = eqIndex === -1 ? "" : rest.slice(eqIndex + 1).trim();

    const irType = parseTypeExpression(typePart);
    const isOptional = computeOptional(irType, defaultPart);

    // Try to extract alias from Field(..., alias="...") if present
    const alias = extractAliasFromDefault(defaultPart);

    return { name, type: irType, isOptional, alias };
}

function findTopLevelEquals(s: string): number {
    let depthBracket = 0;
    let depthParen = 0;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i]!;
        if (ch === "[") depthBracket++;
        else if (ch === "]") depthBracket--;
        else if (ch === "(") depthParen++;
        else if (ch === ")") depthParen--;
        if (depthBracket === 0 && depthParen === 0 && ch === "=") return i;
    }
    return -1;
}

function computeOptional(irType: IrType, defaultPart: string): boolean {
    // Optional by type (union with None)
    if (typeContainsNull(irType)) return true;
    // Defaults don't affect types/optionality unless explicitly None
    if (defaultPart && /\bNone\b/.test(defaultPart)) return true;
    return false;
}

function typeContainsNull(t: IrType): boolean {
    if (t.kind === "literal" && t.value === null) return true;
    if (t.kind === "union") return t.options.some(typeContainsNull);
    return false;
}

function leadingSpaces(s: string): number {
    let n = 0;
    while (n < s.length && s[n] === " ") n++;
    return n;
}

// Extract alias from patterns like Field(..., alias="id") or Field(alias='id')
function extractAliasFromDefault(defaultPart: string): string | undefined {
    if (!defaultPart) return undefined;
    // quick check to avoid unnecessary work
    if (!/\bField\s*\(/.test(defaultPart) || !/\balias\s*=/.test(defaultPart)) {
        return undefined;
    }

    // Find the first parentheses group after Field(
    const fieldCallIndex = defaultPart.search(/\bField\s*\(/);
    if (fieldCallIndex === -1) return undefined;
    let i = fieldCallIndex;
    // move to the opening paren
    i = defaultPart.indexOf("(", i);
    if (i === -1) return undefined;
    let depth = 0;
    let inside = "";
    for (let k = i; k < defaultPart.length; k++) {
        const ch = defaultPart[k]!;
        if (ch === "(") {
            depth++;
            if (depth === 1) continue; // skip the first '('
        } else if (ch === ")") {
            depth--;
            if (depth === 0) break;
        }
        if (depth >= 1) inside += ch;
    }

    if (!inside) return undefined;

    // Now parse keyword args at top level commas
    const parts = splitTopLevelCommas(inside).map((s) => s.trim());
    for (const part of parts) {
        const eq = part.indexOf("=");
        if (eq === -1) continue;
        const key = part.slice(0, eq).trim();
        if (key !== "alias") continue;
        let value = part.slice(eq + 1).trim();
        // value may be a string literal 'id' or "id"
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        return value || undefined;
    }
    return undefined;
}

function splitTopLevelCommas(input: string): string[] {
    const result: string[] = [];
    let token = "";
    let depthParen = 0;
    let depthBracket = 0;
    let inString: string | null = null;
    for (let i = 0; i < input.length; i++) {
        const ch = input[i]!;
        if (inString) {
            token += ch;
            if (ch === inString) {
                inString = null;
            } else if (ch === "\\") {
                // rudimentary escape handling: skip next char
                i++;
                if (i < input.length) token += input[i]!;
            }
            continue;
        }
        if (ch === '"' || ch === "'") {
            inString = ch;
            token += ch;
            continue;
        }
        if (ch === "(") depthParen++;
        else if (ch === ")") depthParen--;
        else if (ch === "[") depthBracket++;
        else if (ch === "]") depthBracket--;
        if (ch === "," && depthParen === 0 && depthBracket === 0) {
            result.push(token);
            token = "";
            continue;
        }
        token += ch;
    }
    if (token) result.push(token);
    return result;
}
