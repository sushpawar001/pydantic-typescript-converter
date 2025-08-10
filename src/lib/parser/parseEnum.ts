import type { IrEnum, IrEnumMember } from "../ir/ast";
import type { Diagnostic } from "../ir/diagnostics";

export interface EnumParseResult {
    enums: IrEnum[];
    diagnostics: Diagnostic[];
}

// Support: class X(Enum):, class X(IntEnum):, class X(StrEnum):
// and multi-base: class X(str, Enum): or class X(Enum, str):
const CLASS_ENUM_RE = /^class\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(\s*([^)]*)\)\s*:/;

export function parseEnumsFromSource(source: string): EnumParseResult {
    const lines = source.replace(/\r\n?/g, "\n").split("\n");
    const enums: IrEnum[] = [];
    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        const match = line.match(CLASS_ENUM_RE);
        if (!match) continue;

        const [, name, basesRaw] = match;
        const headerIndent = leadingSpaces(line);
        const bases = basesRaw
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean);
        const hasEnum = bases.some((b) => /\b(Enum|IntEnum|StrEnum)\b/.test(b));
        if (!hasEnum) continue; // not an Enum class
        const isInt = bases.some((b) => b === "IntEnum");
        const isStringBase = bases.some((b) => b === "str" || b === "StrEnum");
        const members: IrEnumMember[] = [];

        let j = i + 1;
        while (j < lines.length) {
            const ln = lines[j] ?? "";
            const indent = leadingSpaces(ln);
            if (ln.trim() === "") {
                j++;
                continue;
            }
            if (indent <= headerIndent) break; // end of class block
            const trimmed = ln.trim();
            // Stop on inner defs (methods) or decorators
            if (trimmed.startsWith("def ") || trimmed.startsWith("@")) {
                j++;
                continue;
            }
            const mem = parseEnumMember(trimmed);
            if (mem) {
                members.push(mem.member);
                if (mem.diagnostic) diagnostics.push(mem.diagnostic);
            }
            j++;
        }
        i = j - 1; // advance outer loop

        // Validate value types
        const sawString = members.some((m) => typeof m.value === "string");
        const sawNumber = members.some((m) => typeof m.value === "number");
        if (sawString && sawNumber) {
            diagnostics.push({
                severity: "error",
                message: `Enum ${name} has mixed string and number values`,
                range: zeroRange(),
                code: "E_ENUM_MIXED",
            });
        }
        if (isInt && sawString) {
            diagnostics.push({
                severity: "error",
                message: `IntEnum ${name} contains non-integer member(s)`,
                range: zeroRange(),
                code: "E_INTENUM_STRING",
            });
        }

        enums.push({ kind: "enum", name, isInt, isStringBase, members });
    }

    return { enums, diagnostics };
}

function parseEnumMember(
    trimmed: string
): { member: IrEnumMember; diagnostic?: Diagnostic } | null {
    // Pattern: NAME = VALUE  (VALUE can be 'x' / "x" / number)
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return null;
    const left = trimmed.slice(0, eqIndex).trim();
    const right = trimmed.slice(eqIndex + 1).trim();
    if (!/^[_A-Za-z][_A-Za-z0-9]*$/.test(left)) return null;

    if (
        (right.startsWith("'") && right.endsWith("'")) ||
        (right.startsWith('"') && right.endsWith('"'))
    ) {
        return { member: { name: left, value: right.slice(1, -1) } };
    }
    const num = Number(right.replace(/_.*/g, "")); // strip comments after value
    if (!Number.isNaN(num)) return { member: { name: left, value: num } };

    // Unsupported value expression
    return {
        member: { name: left, value: left },
        diagnostic: {
            severity: "warning",
            message: `Unsupported enum value expression: ${right}`,
            range: zeroRange(),
            code: "W_ENUM_VALUE",
        },
    };
}

function leadingSpaces(s: string): number {
    let n = 0;
    while (n < s.length && s[n] === " ") n++;
    return n;
}

function zeroRange() {
    return {
        start: { offset: 0, line: 1, column: 1 },
        end: { offset: 0, line: 1, column: 1 },
    };
}
