import type { IrDeclaration, IrEnum, IrModel, IrType } from "../ir/ast";

export interface NameStrategyOptions {
    modelPrefix?: string; // used for unnamed or collisions if needed
    enumPrefix?: string;
}

const DEFAULTS: Required<NameStrategyOptions> = {
    modelPrefix: "Model",
    enumPrefix: "Enum",
};

export interface RenameResult {
    declarations: IrDeclaration[];
    nameMap: Record<string, string>; // oldName -> newName (first occurrence wins)
}

export function ensureUniqueNames(
    decls: IrDeclaration[],
    opts: NameStrategyOptions = {}
): RenameResult {
    const options = { ...DEFAULTS, ...opts } as Required<NameStrategyOptions>;
    const nameCounts = new Map<string, number>();
    const assigned = new Map<string, string>();

    let modelSeq = 1;
    let enumSeq = 1;

    function nextName(base: string): string {
        const count = (nameCounts.get(base) ?? 0) + 1;
        nameCounts.set(base, count);
        if (count === 1) return base;
        return `${base}${count}`;
    }

    const newNames: string[] = [];
    // First pass: compute new names
    for (const d of decls) {
        const raw = d.name?.trim();
        let baseName = raw && /^[A-Za-z_][A-Za-z0-9_]*$/.test(raw) ? raw : "";
        if (!baseName) {
            if (d.kind === "model")
                baseName = `${options.modelPrefix}${modelSeq++}`;
            else baseName = `${options.enumPrefix}${enumSeq++}`;
        }
        const unique = nextName(baseName);
        newNames.push(unique);
        // Keep first mapping for ref rewrites
        if (!assigned.has(d.name)) assigned.set(d.name, unique);
    }

    const nameMap: Record<string, string> = {};
    for (const [oldName, newName] of assigned.entries()) {
        nameMap[oldName] = newName;
    }

    // Second pass: apply renames and rewrite refs
    const renamed: IrDeclaration[] = decls.map((d, idx) => {
        const newName = newNames[idx] ?? d.name;
        if (d.kind === "enum") {
            const e: IrEnum = { ...d, name: newName };
            return e;
        }
        const m: IrModel = {
            ...d,
            name: newName,
            fields: d.fields.map((f) => ({
                ...f,
                type: rewriteRefs(f.type, nameMap),
            })),
        };
        return m;
    });

    return { declarations: renamed, nameMap };
}

function rewriteRefs(type: IrType, nameMap: Record<string, string>): IrType {
    switch (type.kind) {
        case "ref":
            return { ...type, name: nameMap[type.name] ?? type.name };
        case "array":
            return {
                ...type,
                elementType: rewriteRefs(type.elementType, nameMap),
            };
        case "record":
            return { ...type, valueType: rewriteRefs(type.valueType, nameMap) };
        case "tuple":
            return {
                ...type,
                elements: type.elements.map((e) => rewriteRefs(e, nameMap)),
            };
        case "union":
            return {
                ...type,
                options: type.options.map((o) => rewriteRefs(o, nameMap)),
            };
        default:
            return type;
    }
}
