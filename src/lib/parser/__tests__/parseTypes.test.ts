import { describe, it, expect } from "vitest";
import { parseTypeExpression } from "../parseTypes";

describe("parseTypeExpression", () => {
    it("parses primitives and refs", () => {
        expect(parseTypeExpression("int")).toEqual({
            kind: "primitive",
            name: "int",
        });
        expect(parseTypeExpression("UUID")).toEqual({
            kind: "primitive",
            name: "uuid",
        });
        expect(parseTypeExpression("User")).toEqual({
            kind: "ref",
            name: "User",
        });
    });

    it("parses list, dict, and tuple", () => {
        expect(parseTypeExpression("list[str]")).toEqual({
            kind: "array",
            elementType: { kind: "primitive", name: "str" },
        });
        expect(parseTypeExpression("List[str]")).toEqual({
            kind: "array",
            elementType: { kind: "primitive", name: "str" },
        });
        expect(parseTypeExpression("dict[str, int]")).toEqual({
            kind: "record",
            keyType: "string",
            valueType: { kind: "primitive", name: "int" },
        });
        expect(parseTypeExpression("Dict[str, int]")).toEqual({
            kind: "record",
            keyType: "string",
            valueType: { kind: "primitive", name: "int" },
        });
        expect(parseTypeExpression("tuple[int, str]")).toEqual({
            kind: "tuple",
            elements: [
                { kind: "primitive", name: "int" },
                { kind: "primitive", name: "str" },
            ],
        });
        expect(parseTypeExpression("Tuple[int, str]")).toEqual({
            kind: "tuple",
            elements: [
                { kind: "primitive", name: "int" },
                { kind: "primitive", name: "str" },
            ],
        });

        expect(parseTypeExpression("Set[str]")).toEqual({
            kind: "array",
            elementType: { kind: "primitive", name: "str" },
        });
    });

    it("parses unions and Optional and Literal", () => {
        expect(parseTypeExpression("int | None")).toEqual({
            kind: "union",
            options: [
                { kind: "primitive", name: "int" },
                { kind: "literal", value: null },
            ],
        });
        expect(parseTypeExpression("Union[str, int]")).toEqual({
            kind: "union",
            options: [
                { kind: "primitive", name: "str" },
                { kind: "primitive", name: "int" },
            ],
        });
        expect(parseTypeExpression("Optional[bool]")).toEqual({
            kind: "union",
            options: [
                { kind: "primitive", name: "bool" },
                { kind: "literal", value: null },
            ],
        });
        expect(parseTypeExpression("Literal['A', 'B']")).toEqual({
            kind: "union",
            options: [
                { kind: "literal", value: "A" },
                { kind: "literal", value: "B" },
            ],
        });
    });

    it("parses nested List[Union[int, str]] into array of union", () => {
        expect(parseTypeExpression("List[Union[int, str]]")).toEqual({
            kind: "array",
            elementType: {
                kind: "union",
                options: [
                    { kind: "primitive", name: "int" },
                    { kind: "primitive", name: "str" },
                ],
            },
        });
    });

    it("parses pydantic constrained types as base primitives", () => {
        expect(parseTypeExpression("conint(ge=0, le=120)")).toEqual({
            kind: "primitive",
            name: "int",
        });
        expect(
            parseTypeExpression("constr(min_length=2, max_length=5)")
        ).toEqual({
            kind: "primitive",
            name: "str",
        });
    });

    it("maps EmailStr and PositiveInt to base primitives", () => {
        expect(parseTypeExpression("EmailStr")).toEqual({
            kind: "primitive",
            name: "str",
        });
        expect(parseTypeExpression("PositiveInt")).toEqual({
            kind: "primitive",
            name: "int",
        });
    });
});
