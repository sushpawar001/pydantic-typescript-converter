import { describe, it, expect } from "vitest";
import { mapIrTypeToTs } from "../typeMapping";

describe("mapIrTypeToTs", () => {
    it("maps primitives and collections", () => {
        expect(mapIrTypeToTs({ kind: "primitive", name: "int" })).toBe(
            "number"
        );
        expect(mapIrTypeToTs({ kind: "primitive", name: "str" })).toBe(
            "string"
        );
        expect(mapIrTypeToTs({ kind: "primitive", name: "bool" })).toBe(
            "boolean"
        );
        expect(mapIrTypeToTs({ kind: "primitive", name: "bytes" })).toBe(
            "string"
        );
        expect(
            mapIrTypeToTs({
                kind: "array",
                elementType: { kind: "primitive", name: "str" },
            })
        ).toBe("string[]");
        expect(
            mapIrTypeToTs({
                kind: "record",
                keyType: "string",
                valueType: { kind: "primitive", name: "int" },
            })
        ).toBe("Record<string, number>");
        expect(
            mapIrTypeToTs({
                kind: "tuple",
                elements: [
                    { kind: "primitive", name: "int" },
                    { kind: "primitive", name: "str" },
                ],
            })
        ).toBe("(number | string)[]");
        expect(
            mapIrTypeToTs({
                kind: "tuple",
                elements: [
                    { kind: "primitive", name: "int" },
                    { kind: "primitive", name: "int" },
                ],
            })
        ).toBe("number[]");
    });

    it("maps unions and literals", () => {
        expect(
            mapIrTypeToTs({
                kind: "union",
                options: [
                    { kind: "primitive", name: "int" },
                    { kind: "literal", value: null },
                ],
            })
        ).toBe("number | null");
        expect(mapIrTypeToTs({ kind: "literal", value: "A" })).toBe('"A"');
    });

    it("maps array of union element types with parentheses", () => {
        expect(
            mapIrTypeToTs({
                kind: "array",
                elementType: {
                    kind: "union",
                    options: [
                        { kind: "primitive", name: "int" },
                        { kind: "primitive", name: "str" },
                    ],
                },
            })
        ).toBe("(number | string)[]");
    });
});
