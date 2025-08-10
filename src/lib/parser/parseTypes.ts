import type { IrType } from "../ir/ast";

// Parse a Python type expression subset into IR Type
// Supported: primitives, list[T], dict[K,V], tuple[T1,T2,...], A | B unions, Literal[...], Optional[T]
export function parseTypeExpression(expr: string): IrType {
    let input = expr.trim();
    if (input.startsWith("typing.")) input = input.slice(7);
    // Normalize bare aliases to typing module counterparts
    if (input === "List") input = "list[Any]";
    if (input === "Dict") input = "dict[str, Any]";
    if (input === "Tuple") input = "tuple[Any]";

    // Top-level None literal
    if (input === "None") {
        return { kind: "literal", value: null };
    }

    // Pydantic constrained types don't change the TS base type
    // conint(...) -> int, constr(...) -> str
    if (isTopLevelCall(input, "conint")) {
        return { kind: "primitive", name: "int" };
    }
    if (isTopLevelCall(input, "constr")) {
        return { kind: "primitive", name: "str" };
    }

    // Helper to check surrounding brackets
    function stripOuter(name: string | string[]): string | null {
        const names = Array.isArray(name) ? name : [name];
        for (const n of names) {
            const prefix = n + "[";
            if (input.startsWith(prefix) && input.endsWith("]")) {
                return input.slice(prefix.length, -1);
            }
        }
        return null;
    }

    // Literal[ ... ]
    const literalArgs = stripOuter(["Literal"]);
    if (literalArgs !== null) {
        const parts = splitTopLevel(literalArgs, ",").map((s) => s.trim());
        return {
            kind: "union",
            options: parts.map((p) => parseLiteral(p)),
        };
    }

    // Optional[T] → Union[T, None]
    const optArg = stripOuter(["Optional"]);
    if (optArg !== null) {
        return {
            kind: "union",
            options: [
                parseTypeExpression(optArg),
                { kind: "literal", value: null },
            ],
        };
    }

    // Union[A, B]
    const unionArgs = stripOuter(["Union"]);
    if (unionArgs !== null) {
        const parts = splitTopLevel(unionArgs, ",").map((s) => s.trim());
        return {
            kind: "union",
            options: parts.map(parseTypeExpression),
        };
    }

    // A | B unions (top-level)
    if (input.includes("|")) {
        const parts = splitTopLevel(input, "|").map((s) => s.trim());
        if (parts.length > 1) {
            return { kind: "union", options: parts.map(parseTypeExpression) };
        }
    }

    // list[T]
    const listArg = stripOuter(["list", "List"]);
    if (listArg !== null) {
        return { kind: "array", elementType: parseTypeExpression(listArg) };
    }

    // set[T]
    const setArg = stripOuter(["set", "Set"]);
    if (setArg !== null) {
        return { kind: "array", elementType: parseTypeExpression(setArg) };
    }

    // dict[K, V]
    const dictArgs = stripOuter(["dict", "Dict"]);
    if (dictArgs !== null) {
        const [k, v] = splitTopLevel(dictArgs, ",").map((s) => s.trim());
        const keyType = normalizeRecordKey(k);
        return {
            kind: "record",
            keyType,
            valueType: parseTypeExpression(v ?? "any"),
        };
    }

    // tuple[T1, T2, ...]
    const tupleArgs = stripOuter(["tuple", "Tuple"]);
    if (tupleArgs !== null) {
        const parts = splitTopLevel(tupleArgs, ",").map((s) => s.trim());
        return { kind: "tuple", elements: parts.map(parseTypeExpression) };
    }

    // Ref or Primitive
    return parsePrimitiveOrRef(input);
}

// Detect a top-level call of the form name(...), ensuring the closing paren matches the opening one
function isTopLevelCall(input: string, name: string): boolean {
    const prefix = name + "(";
    if (!input.startsWith(prefix)) return false;
    // Find matching closing paren for the first "(" after the name
    let depth = 0;
    for (let i = name.length; i < input.length; i++) {
        const ch = input[i]!;
        if (ch === "(") depth++;
        else if (ch === ")") {
            depth--;
            if (depth === 0) {
                // matched the initial paren; ensure this is the end of the string
                return i === input.length - 1;
            }
        }
        // basic string literal handling: skip over simple quoted segments
        if (ch === '"' || ch === "'") {
            const quote = ch;
            i++;
            while (i < input.length && input[i] !== quote) {
                // rudimentary escape skip
                if (input[i] === "\\") i++;
                i++;
            }
        }
        // bracket depth shouldn't affect paren matching, ignore
    }
    return false;
}

function splitTopLevel(input: string, sep: string): string[] {
    const result: string[] = [];
    let depth = 0;
    let token = "";
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "[") depth++;
        if (ch === "]") depth--;
        if (depth === 0 && input.slice(i, i + sep.length) === sep) {
            result.push(token);
            token = "";
            i += sep.length - 1;
            continue;
        }
        token += ch;
    }
    if (token) result.push(token);
    return result;
}

function parseLiteral(src: string): IrType {
    const s = src.trim();
    if (s === "None") return { kind: "literal", value: null };
    if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
    ) {
        return { kind: "literal", value: s.slice(1, -1) };
    }
    const n = Number(s);
    if (!Number.isNaN(n)) return { kind: "literal", value: n };
    if (s === "True") return { kind: "literal", value: true };
    if (s === "False") return { kind: "literal", value: false };
    // Fallback to ref
    return { kind: "ref", name: s };
}

function parsePrimitiveOrRef(name: string): IrType {
    const n = name;
    switch (n) {
        case "int":
        case "float":
        case "str":
        case "bool":
        case "bytes":
        case "datetime":
        case "date":
        case "time":
        case "Any":
            return { kind: "primitive", name: n as "any" };
        // Pydantic common aliases → base primitives
        case "EmailStr":
            return { kind: "primitive", name: "str" };
        case "PositiveInt":
            return { kind: "primitive", name: "int" };
        case "Decimal":
            return { kind: "primitive", name: "decimal" };
        case "UUID":
            return { kind: "primitive", name: "uuid" };
        default:
            return { kind: "ref", name: n };
    }
}

function normalizeRecordKey(
    src: string
):
    | "string"
    | "number"
    | "symbol"
    | "string | number"
    | "string | number | symbol" {
    const s = src.trim();
    if (s.includes("|")) {
        const parts = s.split("|").map((p) => p.trim());
        const hasString = parts.some(
            (p) => p === "str" || p.toLowerCase() === "string"
        );
        const hasNumber = parts.some(
            (p) => p === "int" || p === "float" || p.toLowerCase() === "number"
        );
        const hasSymbol = parts.some((p) => p.toLowerCase() === "symbol");
        if (hasString && hasNumber && hasSymbol)
            return "string | number | symbol";
        if (hasString && hasNumber) return "string | number";
        if (hasString) return "string";
        if (hasNumber) return "number";
        if (hasSymbol) return "symbol";
    }
    if (s === "str" || s.toLowerCase() === "string") return "string";
    if (s === "int" || s === "float" || s.toLowerCase() === "number")
        return "number";
    if (s.toLowerCase() === "symbol") return "symbol";
    if (s === "Any") return "string | number | symbol";
    return "string";
}
