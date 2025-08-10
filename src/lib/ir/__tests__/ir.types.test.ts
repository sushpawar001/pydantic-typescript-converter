import { describe, it, expect } from "vitest";
import type { IrModel, IrEnum, IrType } from "../ast";
import type { Diagnostic } from "../diagnostics";

describe("IR shapes", () => {
    it("creates a model IR object", () => {
        const stringType: IrType = { kind: "primitive", name: "str" };
        const optionalNumber: IrType = {
            kind: "union",
            options: [
                { kind: "primitive", name: "int" },
                { kind: "literal", value: null },
            ],
        };

        const model: IrModel = {
            kind: "model",
            name: "User",
            fields: [
                {
                    name: "id",
                    type: { kind: "primitive", name: "uuid" },
                    isOptional: false,
                },
                { name: "name", type: stringType, isOptional: false },
                { name: "age", type: optionalNumber, isOptional: true },
                {
                    name: "tags",
                    type: { kind: "array", elementType: stringType },
                    isOptional: true,
                },
            ],
        };

        expect(model.name).toBe("User");
        expect(model.fields.length).toBe(4);
        expect(model.fields[2]?.isOptional).toBe(true);
    });

    it("creates an enum IR object", () => {
        const colorEnum: IrEnum = {
            kind: "enum",
            name: "Color",
            isInt: false,
            members: [
                { name: "RED", value: "RED" },
                { name: "GREEN", value: "GREEN" },
                { name: "BLUE", value: "BLUE" },
            ],
        };

        expect(colorEnum.members.map((m) => m.name)).toContain("RED");
        expect(colorEnum.isInt).toBe(false);
    });

    it("creates a diagnostic object", () => {
        const diagnostic: Diagnostic = {
            severity: "error",
            message: "Unexpected token",
            range: {
                start: { offset: 10, line: 2, column: 5 },
                end: { offset: 15, line: 2, column: 10 },
            },
            code: "E1001",
        };

        expect(diagnostic.range.start.line).toBe(2);
    });
});
