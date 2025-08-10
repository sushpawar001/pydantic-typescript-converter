import { describe, it, expect } from "vitest";
import { ensureUniqueNames } from "../nameStrategy";

describe("ensureUniqueNames", () => {
    it("keeps unique names and rewrites refs", () => {
        const decls = [
            {
                kind: "model" as const,
                name: "User",
                fields: [
                    {
                        name: "manager",
                        isOptional: true,
                        type: { kind: "ref", name: "User" },
                    },
                ],
            },
            {
                kind: "enum" as const,
                name: "Role",
                isInt: false,
                members: [{ name: "A", value: "A" }],
            },
        ];
        const { declarations } = ensureUniqueNames(decls);
        const user = declarations.find((d) => d.kind === "model")!;
        expect(user.name).toBe("User");
        // ref name is still User after mapping
        // @ts-expect-error narrowing
        expect(user.fields[0].type).toEqual({ kind: "ref", name: "User" });
    });

    it("resolves collisions with suffixes", () => {
        const decls = [
            { kind: "enum" as const, name: "Color", isInt: false, members: [] },
            { kind: "enum" as const, name: "Color", isInt: false, members: [] },
        ];
        const { declarations } = ensureUniqueNames(decls);
        const names = declarations.map((d) => d.name).sort();
        expect(new Set(names).size).toBe(2);
        expect(names.some((n) => n === "Color")).toBe(true);
    });
});
