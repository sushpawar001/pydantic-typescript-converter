## Project: Pydantic → TypeScript Converter (Client‑only)

### Goals and Scope

-   **Purpose**: Convert user‑pasted Python 3.11+ Pydantic models and Enums into valid TypeScript declarations, entirely client‑side.
-   **Key actions**: View inline (read‑only code block), Copy to clipboard, Download as .ts file.
-   **Constraints**: No server code or storage; all logic executes in the browser; fast, accessible, minimalist UI aligned with provided prototypes.

### Non‑Goals

-   Executing Python or importing external packages in the browser.
-   Full Python grammar support. We target the subset required for Pydantic models and Enums.
-   TypeScript to Pydantic models (can be future work).
-   Pydantic models to JSON example (can be future work).

## Architecture Overview

### Runtime

-   **Framework**: Next.js 15 (App Router), React 19, Tailwind CSS v4.
-   **Client‑only**: All parsing, validation, and code generation run in the browser. No API routes, no server actions, no cookies/local storage beyond clipboard and download triggers.

### High‑level Data Flow

1. User pastes Python code into input.
2. Client parser produces an in‑memory **Intermediate Representation (IR)** with a diagnostic list (errors/warnings with ranges).
3. Converter maps IR → TypeScript AST/string.
4. UI renders TS output in a read‑only code block; actions: Copy and Download.
5. Validation layer displays contextual errors with line/column and highlights.

### Core Modules

-   `parser/` — Tokenizer + lightweight parser for a Pydantic‑focused subset of Python.
-   `ir/` — Strongly‑typed IR for Models, Fields, Enums, Types, and Diagnostics.
-   `converter/` — IR → TypeScript generator with configurable naming and formatting.
-   `validation/` — Input validation, error aggregation, and user‑friendly messages.
-   `ui/` — Components for input, output, actions, status, and error surfacing.
-   `utils/` — Clipboard, file download, debounce, text measurement, safe guards.

### Suggested File Structure

```
src/
  app/
    page.tsx
  components/
    InputEditor.tsx
    OutputViewer.tsx
    ActionsBar.tsx
    ValidationAlert.tsx
    Tag.tsx
  lib/
    parser/
      tokenize.ts
      parseModel.ts
      parseEnum.ts
      parseTypes.ts
    ir/
      ast.ts
      diagnostics.ts
    converter/
      tsEmit.ts
      typeMapping.ts
      nameStrategy.ts
    validation/
      validateInput.ts
      rules.ts
    utils/
      copyToClipboard.ts
      downloadFile.ts
      debounce.ts
      textRange.ts
```

## Parsing and Conversion Specification

### Supported Python Constructs (3.11+ focus)

-   **Models**: `class Foo(BaseModel): ...`
    -   Fields with annotations: `name: str`, `age: int | None`, `tags: list[str]`, `items: list[Item]`, `meta: dict[str, int]`
    -   Defaults: `=`, `Field(default=..., default_factory=..., description=...)`
    -   Optional: `Optional[T]`, `T | None`, `Field(default=None)`
    -   Nested models by reference
-   **Enums**: `class Role(Enum): ADMIN = "ADMIN"`, `IntEnum`
-   **Typing**: `list[T]`, `dict[K, V]`, `tuple[...]`, `Literal[...]`, `Union[...]`/`A | B`
-   **Basics**: `int`, `float`, `str`, `bool`, `bytes`, `datetime`, `date`, `time`, `Decimal`, `UUID`, `Any`

Notes:

-   We do not execute validators/functions; we only parse declarative shape and types.
-   Unsupported constructs should produce diagnostics and fall back to `unknown` or `any` per configuration.

### Type Mapping (Python → TypeScript)

-   **int** → `number`
-   **float** → `number`
-   **str** → `string`
-   **bool** → `boolean`
-   **bytes** → `string` (base64) or `Uint8Array` (configurable; default `string`)
-   **datetime/date/time** → `string` (ISO8601)
-   **Decimal** → `string` (preserve precision)
-   **UUID** → `string`
-   **Any** → `any`
-   **list[T]** → `T[]`
-   **dict[K, V]** → `Record<K, V>` (with `K` narrowed to `string | number | symbol` as needed)
-   **tuple[T1, T2]** → `[T1, T2]`
-   **Literal[...]/enum members** → union of literals
-   **Union[A, B] / A | B** → `A | B`
-   **Pydantic model** → `interface` (or `type` with exact object type; default `interface`)
-   **Enum/IntEnum** → `enum` (or union type; default `enum`)

### Optional/Required Rules

-   A field is optional if any of:
    -   Annotated with `Optional[T]` or `T | None`
    -   Has `Field(default=...)` or `= None`
-   Emission:
    -   Optional fields become `name?: T` (or `name: T | undefined` if strict mode configured)

### Name Generation

-   Use declared names for `class Foo(BaseModel)` and `class Color(Enum)`.
-   When multiple top‑level declarations exist, generate each independently.
-   If unnamed or ambiguous (edge cases), auto‑name using:
    -   Preferred: From top‑level key tokens (e.g., variable assignment `User = ...`).
    -   Fallback: `Model1`, `Model2`, `Enum1`, ... in declaration order.

### Error Handling & Diagnostics

-   Tokenizer produces tokens with `line`, `column`, and `offset`.
-   Parser attaches diagnostics with ranges and severity.
-   UI maps diagnostics to inline highlights and a list with jump‑to‑line.
-   Graceful degradation: on error, emit partial TS for valid parts; block Copy/Download if critical.

## UX/UI Specification

### Layout and Interactions

Replicate these UI exactly as it is

-   Dark Theme: "prototypes\final-prototype.html"
-   Light Theme: "prototypes\final-prototype-light.html"

### Accessibility

-   Keyboard accessible controls (Tab/Shift+Tab traversal).
-   Proper ARIA roles for code, alerts, and buttons.
-   Sufficient color contrast; focus states visible.

## Performance & Security

-   Parser runs in O(n) over input size; target < 200ms for typical inputs (< 5k lines).
-   Debounce input to reduce re‑parsing during fast typing.
-   No eval, no web workers initially; consider worker if needed.
-   Clipboard and download use standard Web APIs; no data leaves the client.

## TDD Strategy and Tooling

### Test Stack

-   **Unit**: Vitest + ts‑jest like transformers unnecessary; native TS via `ts-node`/esbuild. React Testing Library for components.
-   **Integration**: Vitest node environment for parser→converter pipelines.
-   ~~E2E: Playwright for UI scenarios (convert, copy, download, error states).~~
-   **Static analysis**: ESLint (already present). TypeScript strict mode.

### Coverage Targets

-   90%+ statements/branches for `parser/` and `converter/`.
-   Critical UI flows covered via integration tests.

### Representative Test Matrix (subset)

-   Models: required vs optional fields; defaults; `Field(default=None)`; `Optional[T]`; `T | None`.
-   Collections: `list[T]`, nested lists, `dict[str, int]`, tuples.
-   Unions: `A | B | None`, `Union[A, B]`.
-   Literals: `Literal["A", "B"]`.
-   Enums: `Enum` with strings, `IntEnum` with numbers; mixed whitespace and comments.
-   Nested models across files pasted together; reference ordering.
-   Invalid syntax: missing colons, bad brackets, unknown identifiers; diagnostics generated.
-   Large input performance smoke test.

## Tasks and Subtasks (with Acceptance Criteria)

### 1) Project Tooling and Quality Gates

-   Add dev tools: Vitest, @testing-library/react, jsdom, and types.
-   Configure scripts: `test`, `test:watch`, `test:coverage`.
-   Enable TS strict mode in `tsconfig.json` for `lib/`.
-   CI workflow: install, lint, unit, integration, build.
-   Acceptance: All scripts run green locally; CI badge shows passing.

### 2) IR and Diagnostics

-   [x] Done

-   Define IR types: `IrModel`, `IrField`, `IrEnum`, `IrType`, `Diagnostic`.
-   Acceptance: Type tests compile; sample IR objects validated in unit tests.

### 3) Tokenizer

-   [x] Done

-   Implement tokenizer for identifiers, keywords (`class`, `Enum`, `BaseModel`, `Field`, typing names), literals, brackets, colon, equals, pipes, commas, dots, newlines, comments.
-   Acceptance: Unit tests cover tokens for representative lines; correct line/column tracking.

### 4) Parser: Types

-   [x] Done

-   Parse basic and composite types: primitives, `list[T]`, `dict[K,V]`, tuples, unions (`A | B`), `Literal[...]`.
-   Acceptance: Unit tests for each form; error diagnostics for malformed generics/unions.

### 5) Parser: Enums

-   [x] Done

-   Parse `class Name(Enum/IntEnum)` with members to IR; support string and int values; ignore methods.
-   Acceptance: Unit tests for string and int enums; diagnostics for mixed/invalid values.

### 6) Parser: Models

-   [x] Done

-   Parse `class Name(BaseModel)` and fields with annotations/defaults/Field(...); optionality rules; nested references.
-   Acceptance: Unit tests verifying field shapes, optional flags, and nested references IR.

### 7) Converter: Type Mapping

-   [x] Done

-   Implement Python→TS mapping based on spec, including Record keys constraints, tuple emission, literal unions.
-   Acceptance: Unit tests mapping IR types to expected TS snippets.

### 8) Converter: Emit Interfaces and Enums

-   [x] Done

-   Generate `interface` for models and `enum` for enums; stable order; doc comments if available; optional fields with `?`.
-   Acceptance: Snapshot tests for representative inputs.

### 9) Naming Strategy

-   [x] Done

-   Implement name inference from declarations and fallback sequence (Model1/Enum1...). Configurable prefix.
-   Acceptance: Unit tests for multi‑declaration inputs and ambiguous cases.

### 10) Validation Layer

-   [x] Done

-   Aggregate diagnostics with severity; block Copy/Download on critical errors; show inline messages.
-   Acceptance: Integration tests where invalid inputs prevent actions; messages match line/column.

### 11) UI Components

-   [x] Done
-   Breakdown UI in seperate components as much possible
-   All possilbe components should be server side components

### 12) Page Integration

-   [x] Done
-   Compose components in `app/page.tsx`; manage state; wire parser→converter; debounce; loading/idle states.
-   Acceptance: Core flows verified via unit/integration tests and manual smoke checks; accessibility checks.

### 13) Styling & A11y Polish

-   [x] Done (Dark and Light themes match prototypes exactly)
-   Tailwind classes per prototype; focus rings; responsive layout.
-   Acceptance: Visual regression baseline (optional), manual a11y audit.

### 14) Documentation

-   [x] Done
-   Update `README.md`: features, limitations, run/test commands, contribution guide.
-   Add examples of Python input and TS output; list of supported constructs.
-   Acceptance: Docs build served locally; links verified.

## Acceptance Criteria Summary

-   Client‑only conversion with accurate mappings for specified constructs.
-   Inline view, working Copy and Download actions.
-   Clear error messages with line/column; actions disabled on critical errors.
-   Test suite green with coverage targets met; build succeeds; no ESLint errors.

## Risks & Mitigations

-   **Python subset ambiguity**: Constrain grammar; produce diagnostics; document unsupported features.
-   **Performance on large inputs**: Debounce; consider Web Worker offload if needed.
-   **Type fidelity (e.g., Decimal/bytes)**: Provide configuration and document defaults.

## Definition of Done

-   Feature set complete per spec, fully client‑side.
-   All tests (unit/integration) pass; coverage targets met.
-   A11y and performance baselines met; no critical diagnostics from lint/build.
-   README updated; ready for deployment.

## Knowledge Transfer (What we learned and issues faced)

-   Parsing nuances

    -   Needed to support both builtins and typing aliases: `list`/`List`, `dict`/`Dict`, `tuple`/`Tuple`, `set`/`Set`, and optional `typing.` prefix.
    -   Defaults should not affect optionality unless default is explicitly `None`. Adjusted model parser to reflect this.
    -   Treat `Set[T]` as arrays in TS for ergonomic output: `T[]`.

-   TypeScript mapping decisions

    -   Lists map to `T[]`; tuples were requested to behave like homogeneous arrays in TS: `[T1, T2]` → `(T1 | T2)[]`, collapsing identical primitives to `T[]`.
    -   Bytes/Decimal/UUID mapped to strings by default for portability.

-   UI parity

    -   Achieving exact prototype fidelity required body‑scoped theme classes and vignette overlays. Applied `theme-dark`/`theme-light` to `<body>` and mirrored gradients, shadows, and borders from prototypes.
    -   Added a small client-only wrapper to load Lucide icons and re-render on theme change.

-   Testing/tooling

    -   Vitest + jsdom used for unit tests.
    -   PostCSS v4 config must use plugin map; Tailwind v4 expects `@tailwindcss/postcss` as plugin.

-   Performance
    -   Debounced parsing in the client input by ~150ms to keep typing smooth on larger inputs, in line with plan’s performance guidance.
