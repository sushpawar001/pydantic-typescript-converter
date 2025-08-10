import { describe, it, expect } from "vitest";
import { parseEnumsFromSource } from "../parseEnum";

describe("parseEnumsFromSource", () => {
    it("parses simple string Enum", () => {
        const src = `
class Role(Enum):
    ADMIN = "ADMIN"
    USER = "USER"
`;
        const { enums, diagnostics } = parseEnumsFromSource(src);
        expect(diagnostics.length).toBe(0);
        expect(enums.length).toBe(1);
        const e = enums[0]!;
        expect(e.name).toBe("Role");
        expect(e.isInt).toBe(false);
        expect(e.isStringBase).toBeFalsy();
        expect(e.members).toEqual([
            { name: "ADMIN", value: "ADMIN" },
            { name: "USER", value: "USER" },
        ]);
    });

    it("parses IntEnum with numeric values and warns on strings", () => {
        const src = `
class Code(IntEnum):
    A = 1
    B = 2
`;
        const { enums, diagnostics } = parseEnumsFromSource(src);
        expect(enums[0]?.isInt).toBe(true);
        expect(diagnostics.length).toBe(0);
    });

    it("emits diagnostic for mixed value types", () => {
        const src = `
class Mixed(Enum):
    A = 1
    B = "B"
`;
        const { diagnostics } = parseEnumsFromSource(src);
        expect(diagnostics.some((d) => d.code === "E_ENUM_MIXED")).toBe(true);
    });

    it("recognizes multi-base class with str, Enum as string-base", () => {
        const src = `
class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
`;
        const { enums, diagnostics } = parseEnumsFromSource(src);
        expect(diagnostics.length).toBe(0);
        expect(enums.length).toBe(1);
        const e = enums[0]!;
        expect(e.name).toBe("Role");
        expect(e.isInt).toBe(false);
        expect(e.isStringBase).toBe(true);
        expect(e.members.length).toBe(2);
    });

    it("recognizes StrEnum as string-base", () => {
        const src = `
class Status(StrEnum):
    OPEN = "open"
    CLOSED = "closed"
`;
        const { enums } = parseEnumsFromSource(src);
        const e = enums[0]!;
        expect(e.isStringBase).toBe(true);
    });
});
