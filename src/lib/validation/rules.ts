import type { Diagnostic } from "../ir/diagnostics";
import type { IrDeclaration } from "../ir/ast";

export function validateDeclarations(decls: IrDeclaration[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const d of decls) {
        if (d.kind === "model") {
            for (const f of d.fields) {
                if (!/^[_A-Za-z][_A-Za-z0-9]*$/.test(f.name)) {
                    diagnostics.push(
                        makeError(`Invalid field name '${f.name}' in ${d.name}`)
                    );
                }
            }
        }
    }
    return diagnostics;
}

function makeError(message: string): Diagnostic {
    return {
        severity: "error",
        message,
        range: {
            start: { offset: 0, line: 1, column: 1 },
            end: { offset: 0, line: 1, column: 1 },
        },
        code: "E_VALIDATE",
    };
}
