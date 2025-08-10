export type TokenKind =
    | "identifier"
    | "keyword"
    | "string"
    | "number"
    | "colon"
    | "equals"
    | "pipe"
    | "comma"
    | "dot"
    | "lbracket"
    | "rbracket"
    | "lparen"
    | "rparen"
    | "newline"
    | "comment";

export interface TokenPosition {
    offset: number;
    line: number; // 1-based
    column: number; // 1-based
}

export interface Token {
    kind: TokenKind;
    value: string;
    start: TokenPosition;
    end: TokenPosition;
}

export const KEYWORDS = new Set([
    "class",
    "Enum",
    "IntEnum",
    "BaseModel",
    "Field",
    // typing constructs
    "list",
    "dict",
    "tuple",
    "Literal",
    "Union",
    "Optional",
    "None",
    // primitives
    "int",
    "float",
    "str",
    "bool",
    "bytes",
    "datetime",
    "date",
    "time",
    "Decimal",
    "UUID",
    "Any",
]);
