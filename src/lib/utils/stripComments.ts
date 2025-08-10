// Removes Python comments starting with '#' outside of strings.
// Preserves content inside single, double, and triple-quoted strings.
export function stripComments(source: string): string {
    const input = source;
    let i = 0;
    const n = input.length;
    let out = "";

    type Mode = "none" | "single" | "double" | "tripleSingle" | "tripleDouble";
    let mode: Mode = "none";

    while (i < n) {
        const ch = input[i]!;
        const next3 = input.slice(i, i + 3);

        if (mode === "none") {
            if (next3 === "'''") {
                mode = "tripleSingle";
                out += next3;
                i += 3;
                continue;
            }
            if (next3 === '"""') {
                mode = "tripleDouble";
                out += next3;
                i += 3;
                continue;
            }
            if (ch === "'") {
                mode = "single";
                out += ch;
                i += 1;
                continue;
            }
            if (ch === '"') {
                mode = "double";
                out += ch;
                i += 1;
                continue;
            }
            if (ch === "#") {
                // skip until newline, but keep the newline
                while (i < n && input[i] !== "\n") i++;
                if (i < n && input[i] === "\n") {
                    out += "\n";
                    i += 1;
                }
                continue;
            }
            out += ch;
            i += 1;
            continue;
        }

        if (mode === "single") {
            if (ch === "\\" && i + 1 < n) {
                out += input[i]! + input[i + 1]!;
                i += 2;
                continue;
            }
            out += ch;
            i += 1;
            if (ch === "'") mode = "none";
            continue;
        }

        if (mode === "double") {
            if (ch === "\\" && i + 1 < n) {
                out += input[i]! + input[i + 1]!;
                i += 2;
                continue;
            }
            out += ch;
            i += 1;
            if (ch === '"') mode = "none";
            continue;
        }

        if (mode === "tripleSingle") {
            if (next3 === "'''") {
                out += next3;
                i += 3;
                mode = "none";
                continue;
            }
            out += ch;
            i += 1;
            continue;
        }

        // mode === "tripleDouble"
        if (next3 === '"""') {
            out += next3;
            i += 3;
            mode = "none";
            continue;
        }
        out += ch;
        i += 1;
    }

    return out;
}
