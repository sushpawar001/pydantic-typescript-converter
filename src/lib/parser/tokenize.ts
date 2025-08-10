import type { Token, TokenPosition, TokenKind } from "./types";
import { KEYWORDS } from "./types";

function createPosition(
    offset: number,
    line: number,
    column: number
): TokenPosition {
    return { offset, line, column };
}

function makeToken(
    kind: TokenKind,
    value: string,
    startOffset: number,
    startLine: number,
    startColumn: number,
    endOffset: number,
    endLine: number,
    endColumn: number
): Token {
    return {
        kind,
        value,
        start: createPosition(startOffset, startLine, startColumn),
        end: createPosition(endOffset, endLine, endColumn),
    };
}

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    let line = 1;
    let col = 1;

    function peek(n = 0): string {
        return input[i + n] ?? "";
    }
    function advance(n = 1): string {
        let s = "";
        for (let k = 0; k < n; k++) {
            const ch = input[i++];
            s += ch ?? "";
            if (ch === "\n") {
                line += 1;
                col = 1;
            } else {
                col += 1;
            }
        }
        return s;
    }

    function isAlpha(ch: string): boolean {
        return /[A-Za-z_]/.test(ch);
    }
    function isAlphaNum(ch: string): boolean {
        return /[A-Za-z0-9_]/.test(ch);
    }
    function isDigit(ch: string): boolean {
        return /[0-9]/.test(ch);
    }

    while (i < input.length) {
        const ch = peek();

        // whitespace (except newlines)
        if (ch === " " || ch === "\t" || ch === "\r") {
            advance();
            continue;
        }

        // newline
        if (ch === "\n") {
            const startOffset = i;
            const startLine = line;
            const startCol = col;
            advance();
            tokens.push(
                makeToken(
                    "newline",
                    "\n",
                    startOffset,
                    startLine,
                    startCol,
                    i,
                    line,
                    col
                )
            );
            continue;
        }

        // comments: # ... to end of line
        if (ch === "#") {
            const startOffset = i;
            const startLine = line;
            const startCol = col;
            let value = "";
            while (i < input.length && peek() !== "\n") {
                value += advance();
            }
            tokens.push(
                makeToken(
                    "comment",
                    value,
                    startOffset,
                    startLine,
                    startCol,
                    i,
                    line,
                    col
                )
            );
            continue;
        }

        // strings: single or double quoted, naive (no escapes for now)
        if (ch === '"' || ch === "'") {
            const quote = ch;
            const startOffset = i;
            const startLine = line;
            const startCol = col;
            let value = advance(); // consume opening quote
            while (i < input.length) {
                const c = peek();
                value += advance();
                if (c === quote) break;
                if (c === "\n" || c === "") break; // unterminated safeguard
            }
            tokens.push(
                makeToken(
                    "string",
                    value,
                    startOffset,
                    startLine,
                    startCol,
                    i,
                    line,
                    col
                )
            );
            continue;
        }

        // punctuation
        const punctMap: Record<string, TokenKind> = {
            ":": "colon",
            "=": "equals",
            "|": "pipe",
            ",": "comma",
            ".": "dot",
            "[": "lbracket",
            "]": "rbracket",
            "(": "lparen",
            ")": "rparen",
        };
        const punctKind = punctMap[ch];
        if (punctKind) {
            const startOffset = i;
            const startLine = line;
            const startCol = col;
            advance();
            tokens.push(
                makeToken(
                    punctKind,
                    ch,
                    startOffset,
                    startLine,
                    startCol,
                    i,
                    line,
                    col
                )
            );
            continue;
        }

        // number literal (integers only for now)
        if (isDigit(ch)) {
            const startOffset = i;
            const startLine = line;
            const startCol = col;
            let value = "";
            while (isDigit(peek())) value += advance();
            tokens.push(
                makeToken(
                    "number",
                    value,
                    startOffset,
                    startLine,
                    startCol,
                    i,
                    line,
                    col
                )
            );
            continue;
        }

        // identifier / keyword
        if (isAlpha(ch)) {
            const startOffset = i;
            const startLine = line;
            const startCol = col;
            let value = "";
            while (isAlphaNum(peek())) value += advance();
            const kind: TokenKind = KEYWORDS.has(value)
                ? "keyword"
                : "identifier";
            tokens.push(
                makeToken(
                    kind,
                    value,
                    startOffset,
                    startLine,
                    startCol,
                    i,
                    line,
                    col
                )
            );
            continue;
        }

        // unknown char → skip to avoid infinite loops
        advance();
    }

    return tokens;
}
