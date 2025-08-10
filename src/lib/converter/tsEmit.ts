import type { IrDeclaration, IrEnum, IrField, IrModel } from "../ir/ast";
import { mapIrTypeToTs } from "./typeMapping";

export interface EmitOptions {
    preferInterface?: boolean; // for models
}

const DEFAULT_EMIT: Required<EmitOptions> = {
    preferInterface: true,
};

export function emitDeclarations(
    decls: IrDeclaration[],
    opts: EmitOptions = {}
): string {
    const options = { ...DEFAULT_EMIT, ...opts } as Required<EmitOptions>;
    return decls
        .map((d) => (d.kind === "enum" ? emitEnum(d) : emitModel(d, options)))
        .join("\n\n");
}

function emitModel(model: IrModel, opts: Required<EmitOptions>): string {
    const header = opts.preferInterface
        ? `export interface ${model.name} {`
        : `export type ${model.name} = {`;
    const fields = model.fields
        .map((f) => emitField(f))
        .map((l) => `  ${l}`)
        .join("\n");
    const footer = opts.preferInterface ? "}" : "};";
    return `${header}\n${fields}\n${footer}`;
}

function emitField(field: IrField): string {
    const optional = field.isOptional ? "?" : "";
    const type = mapIrTypeToTs(field.type);
    const rawName = field.alias ?? field.name;
    const propName = formatPropertyName(rawName);
    return `${propName}${optional}: ${type};`;
}

function emitEnum(e: IrEnum): string {
    // If enum is string-based (explicit base) or all members are strings, emit TS string literal union type
    const allString = e.members.every((m) => typeof m.value === "string");
    if (e.isStringBase || (!e.isInt && allString)) {
        const literals = e.members
            .map((m) => JSON.stringify(m.value))
            .join(" | ");
        return `export type ${e.name} = ${literals};`;
    }
    const members = e.members
        .map((m) => `  ${m.name} = ${JSON.stringify(m.value)},`)
        .join("\n");
    return `export enum ${e.name} {\n${members}\n}`;
}

// Ensures property names are valid in TypeScript output. If not a valid
// identifier or a reserved word, quote it as a string literal key.
function formatPropertyName(name: string): string {
    const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
    const RESERVED = new Set([
        // ES keywords and common restricted names
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "export",
        "extends",
        "finally",
        "for",
        "function",
        "if",
        "import",
        "in",
        "instanceof",
        "new",
        "return",
        "super",
        "switch",
        "this",
        "throw",
        "try",
        "typeof",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "enum",
        "await",
        "implements",
        "package",
        "protected",
        "interface",
        "private",
        "public",
        "let",
        "static",
        "any",
        "boolean",
        "constructor",
        "declare",
        "get",
        "module",
        "require",
        "number",
        "string",
        "symbol",
        "type",
        "from",
        "as",
    ]);
    if (IDENTIFIER_RE.test(name) && !RESERVED.has(name)) {
        return name;
    }
    return JSON.stringify(name);
}
