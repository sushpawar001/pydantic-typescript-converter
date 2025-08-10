import { describe, it, expect } from "vitest";
import { emitDeclarations } from "../tsEmit";

describe("emitDeclarations", () => {
    it("emits interface and enum", () => {
        const output = emitDeclarations([
            {
                kind: "model",
                name: "User",
                fields: [
                    {
                        name: "id",
                        isOptional: false,
                        type: { kind: "primitive", name: "uuid" },
                    },
                    {
                        name: "name",
                        isOptional: false,
                        type: { kind: "primitive", name: "str" },
                    },
                    {
                        name: "age",
                        isOptional: true,
                        type: {
                            kind: "union",
                            options: [
                                { kind: "primitive", name: "int" },
                                { kind: "literal", value: null },
                            ],
                        },
                    },
                ],
            },
            {
                kind: "enum",
                name: "Color",
                isInt: false,
                members: [
                    { name: "RED", value: "RED" },
                    { name: "GREEN", value: "GREEN" },
                ],
            },
        ]);
        expect(output).toContain("export interface User");
        expect(output).toContain("id: string");
        expect(output).toContain("name: string");
        expect(output).toContain("age?: number | null");
        // String enums are emitted as string literal unions
        expect(output).toContain('export type Color = "RED" | "GREEN";');
    });

    it("emits array of union types with parentheses for precedence", () => {
        const output = emitDeclarations([
            {
                kind: "model",
                name: "Data",
                fields: [
                    {
                        name: "items",
                        isOptional: false,
                        type: {
                            kind: "array",
                            elementType: {
                                kind: "union",
                                options: [
                                    { kind: "primitive", name: "int" },
                                    { kind: "primitive", name: "str" },
                                ],
                            },
                        },
                    },
                ],
            },
        ]);
        expect(output).toContain("export interface Data");
        expect(output).toContain("items: (number | string)[]");
    });

    it("uses alias for field name when present", () => {
        const output = emitDeclarations([
            {
                kind: "model",
                name: "Product",
                fields: [
                    {
                        name: "product_id",
                        alias: "id",
                        isOptional: false,
                        type: { kind: "primitive", name: "int" },
                    },
                    {
                        name: "product_name",
                        alias: "name",
                        isOptional: false,
                        type: { kind: "primitive", name: "str" },
                    },
                ],
            },
        ]);
        expect(output).toContain("export interface Product");
        expect(output).toContain("id: number");
        expect(output).toContain("name: string");
        expect(output).not.toContain("product_id");
        expect(output).not.toContain("product_name");
    });

    it("emits string literal union for string-based enums via bases", () => {
        const output = emitDeclarations([
            {
                kind: "enum",
                name: "Role",
                isInt: false,
                isStringBase: true,
                members: [
                    { name: "ADMIN", value: "admin" },
                    { name: "USER", value: "user" },
                ],
            },
            {
                kind: "model",
                name: "Account",
                fields: [
                    {
                        name: "role",
                        isOptional: false,
                        type: { kind: "ref", name: "Role" },
                    },
                ],
            },
        ]);
        expect(output).toContain('export type Role = "admin" | "user";');
        expect(output).toContain("export interface Account");
        expect(output).toContain("role: Role");
    });
});
