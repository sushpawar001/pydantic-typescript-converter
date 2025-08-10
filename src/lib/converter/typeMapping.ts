import type {
    IrType,
    IrTypeLiteral,
    IrTypePrimitive,
    IrTypeRecord,
    IrTypeRef,
} from "../ir/ast";

export interface TypeMappingOptions {
    bytesAs?: "string" | "Uint8Array";
    dateTimeAs?: "string"; // future extension
}

const DEFAULT_OPTS: Required<TypeMappingOptions> = {
    bytesAs: "string",
    dateTimeAs: "string",
};

export function mapIrTypeToTs(
    type: IrType,
    opts: TypeMappingOptions = {}
): string {
    const options = {
        ...DEFAULT_OPTS,
        ...opts,
    } as Required<TypeMappingOptions>;
    switch (type.kind) {
        case "primitive":
            return mapPrimitive(type, options);
        case "array":
            // Wrap union element types in parentheses to ensure correct TS precedence
            if (type.elementType.kind === "union") {
                return `(${mapIrTypeToTs(type.elementType, options)})[]`;
            }
            return `${mapIrTypeToTs(type.elementType, options)}[]`;
        case "record":
            return `Record<${mapRecordKey(type)}, ${mapIrTypeToTs(
                type.valueType,
                options
            )}>`;
        case "tuple": {
            const elementTypes = type.elements.map((e) =>
                mapIrTypeToTs(e, options)
            );
            const unique = Array.from(new Set(elementTypes));
            const union = unique.join(" | ");
            // Map tuple of primitives to array of primitive unions, per requirement
            return unique.length === 1 ? `${unique[0]}[]` : `(${union})[]`;
        }
        case "union":
            return type.options
                .map((o) => mapIrTypeToTs(o, options))
                .join(" | ");
        case "literal":
            return mapLiteral(type);
        case "ref":
            return (type as IrTypeRef).name;
    }
}

function mapPrimitive(
    p: IrTypePrimitive,
    opts: Required<TypeMappingOptions>
): string {
    switch (p.name) {
        case "int":
        case "float":
            return "number";
        case "str":
            return "string";
        case "bool":
            return "boolean";
        case "bytes":
            return opts.bytesAs;
        case "datetime":
        case "date":
        case "time":
            return opts.dateTimeAs;
        case "decimal":
            return "string";
        case "uuid":
            return "string";
        case "any":
            return "any";
        default:
            return "any";
    }
}

function mapRecordKey(r: IrTypeRecord): string {
    switch (r.keyType) {
        case "string":
            return "string";
        case "number":
            return "number";
        case "symbol":
            return "symbol";
        case "string | number":
            return "string | number";
        case "string | number | symbol":
            return "string | number | symbol";
        default:
            return "string";
    }
}

function mapLiteral(l: IrTypeLiteral): string {
    if (typeof l.value === "string") return JSON.stringify(l.value);
    if (l.value === null) return "null";
    return String(l.value);
}
