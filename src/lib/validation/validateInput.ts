import type { Diagnostic } from "../ir/diagnostics";
import type { IrDeclaration } from "../ir/ast";
import { parseEnumsFromSource } from "../parser/parseEnum";
import { parseModelsFromSource } from "../parser/parseModel";
import { ensureUniqueNames } from "../converter/nameStrategy";
import { validateDeclarations } from "./rules";
import { stripComments } from "../utils/stripComments";

export interface ValidationResult {
    declarations: IrDeclaration[];
    diagnostics: Diagnostic[];
}

export function validateAndParsePythonSource(source: string): ValidationResult {
    const preprocessed = stripComments(source);
    const { enums, diagnostics: enumDiags } =
        parseEnumsFromSource(preprocessed);
    const { models, diagnostics: modelDiags } =
        parseModelsFromSource(preprocessed);
    const declarationsRaw: IrDeclaration[] = [...models, ...enums];
    const { declarations } = ensureUniqueNames(declarationsRaw);
    const validationDiags = validateDeclarations(declarations);
    const diagnostics: Diagnostic[] = [
        ...enumDiags,
        ...modelDiags,
        ...validationDiags,
    ];
    return { declarations, diagnostics };
}

export function hasCriticalErrors(diags: Diagnostic[]): boolean {
    return diags.some((d) => d.severity === "error");
}
