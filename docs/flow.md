## Overview

Client-only tool that converts Python Pydantic models and Enums into TypeScript declarations entirely in the browser.

## Data flow

```mermaid
graph TD
  UI["ClientApp (React)"] -- src (debounced) --> Validate["validateAndParsePythonSource"]
  Validate --> Strip["stripComments"]
  Strip --> ParseEnums["parseEnumsFromSource"]
  Strip --> ParseModels["parseModelsFromSource"]
  ParseEnums --> IR["IR declarations (models + enums)"]
  ParseModels --> IR
  IR --> Names["ensureUniqueNames"]
  Names --> Rules["validateDeclarations"]
  Rules -- diagnostics --> UI
  UI --> Emit["emitDeclarations"]
  Emit --> Map["mapIrTypeToTs"]
  Map --> TS["TypeScript code (string)"]
  TS --> Viewer["OutputViewer (pre/code)"]

  subgraph "UI"
    UI
    Viewer
  end

  subgraph "Core"
    Validate
    Strip
    ParseEnums
    ParseModels
    IR
    Names
    Rules
    Emit
    Map
    TS
  end
```

## Pipeline (concise)

-   **Preprocess**: `stripComments` removes Python `#` comments outside strings to simplify parsing.
-   **Parse**:
    -   `parseEnumsFromSource` finds `class X(Enum/IntEnum/StrEnum):` blocks, extracts members and value types.
    -   `parseModelsFromSource` finds `class X(BaseModel):` blocks and field lines `name: Type = default`.
    -   Field types are parsed by `parseTypeExpression` (supports primitives, `list[T]`, `dict[K,V]`, tuples, `Union`/`Optional`, literals, refs).
-   **Normalize**: `ensureUniqueNames` guarantees unique model/enum names and rewrites refs.
-   **Validate**: `validateDeclarations` returns diagnostics (e.g., mixed enum value types, invalid identifiers).
-   **Emit**: `emitDeclarations` serializes IR to TS (interfaces/types/enums), delegating per-field type mapping to `mapIrTypeToTs`.

## UI integration

-   `ClientApp` debounces input (150ms), runs the pipeline, and shows diagnostics via `ValidationAlert`.
-   Copy/Download actions use `copyToClipboard` and a blob-based download; disabled when `hasCriticalErrors` is true.

## Key entry points

-   `validateAndParsePythonSource(source)` → `{ declarations, diagnostics }`
-   `emitDeclarations(declarations)` → `string` (TypeScript)
