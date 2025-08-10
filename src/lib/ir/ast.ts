export type IrPrimitiveTypeName =
    | "int"
    | "float"
    | "str"
    | "bool"
    | "bytes"
    | "datetime"
    | "date"
    | "time"
    | "decimal"
    | "uuid"
    | "any";

export interface IrTypePrimitive {
    kind: "primitive";
    name: IrPrimitiveTypeName;
}

export interface IrTypeArray {
    kind: "array";
    elementType: IrType;
}

export interface IrTypeRecord {
    kind: "record";
    keyType:
        | "string"
        | "number"
        | "symbol"
        | "string | number"
        | "string | number | symbol";
    valueType: IrType;
}

export interface IrTypeTuple {
    kind: "tuple";
    elements: IrType[];
}

export interface IrTypeUnion {
    kind: "union";
    options: IrType[];
}

export interface IrTypeLiteral {
    kind: "literal";
    value: string | number | boolean | null;
}

export interface IrTypeRef {
    kind: "ref";
    name: string; // Reference to a Pydantic model or Enum by name
}

export type IrType =
    | IrTypePrimitive
    | IrTypeArray
    | IrTypeRecord
    | IrTypeTuple
    | IrTypeUnion
    | IrTypeLiteral
    | IrTypeRef;

export interface IrField {
    name: string;
    type: IrType;
    isOptional: boolean;
    // When present, this is the serialized name (e.g., Pydantic Field alias)
    alias?: string;
    description?: string;
}

export interface IrModel {
    kind: "model";
    name: string;
    fields: IrField[];
    doc?: string;
}

export interface IrEnumMember {
    name: string;
    value: string | number;
}

export interface IrEnum {
    kind: "enum";
    name: string;
    members: IrEnumMember[];
    isInt: boolean; // whether this originated from IntEnum
    // Whether this enum is explicitly string-based (e.g., class X(str, Enum) or StrEnum)
    isStringBase?: boolean;
    doc?: string;
}

export type IrDeclaration = IrModel | IrEnum;
