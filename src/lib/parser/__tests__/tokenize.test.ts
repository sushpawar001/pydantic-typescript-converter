import { describe, it, expect } from "vitest";
import { tokenize } from "../tokenize";

describe("tokenize", () => {
    it("tokenizes identifiers, keywords, punctuation, and newlines with positions", () => {
        const src =
            'class User(BaseModel):\n    name: str = "John"  # comment\n';
        const tokens = tokenize(src);
        const kinds = tokens.map((t) => t.kind);
        expect(kinds).toContain("keyword"); // class
        expect(kinds).toContain("identifier"); // User
        expect(kinds).toContain("lparen");
        expect(kinds).toContain("rparen");
        expect(kinds).toContain("colon");
        expect(kinds).toContain("newline");
        expect(kinds).toContain("string");
        expect(kinds).toContain("comment");
        const firstNewline = tokens.find((t) => t.kind === "newline");
        expect(firstNewline?.start.line).toBe(1);
        expect(firstNewline?.end.line).toBe(2);
    });
});
