## Pydantic → TypeScript Converter (Client‑only)

Convert user‑pasted Python 3.11+ Pydantic models and Enums into valid TypeScript declarations, entirely in the browser. No servers, no storage.

### Features

-   Client‑only parsing and conversion
-   Supported: BaseModel classes, Enums/IntEnum, `list[T]`, `dict[K,V]`, tuples, unions (`A | B` / `Union[...]`), `Literal[...]`, optionals
-   Strong IR + generator → `interface` and `enum` output
-   Copy to clipboard and download `.ts`
-   Exact UI parity with provided prototypes (dark/light)

### Limitations

-   Python subset focused on Pydantic declarations (no validators/functions execution)
-   Unsupported constructs emit diagnostics and fall back to `any`/`unknown`

### Getting Started

```
npm run dev
```

Open http://localhost:3000.

### Analytics

This app uses Google Analytics via the official `@next/third-parties/google` package. Provide your GA4 Measurement ID via environment variable:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

The script is loaded only in production builds and only when the variable is set.

### Scripts

```
# lint
npm run lint

# unit tests
npm run test

# build
npm run build
```

### Example

Python:

```python
from pydantic import BaseModel
from enum import Enum

class Role(Enum):
    ADMIN = "ADMIN"

class User(BaseModel):
    id: int
    name: str
    role: Role
    age: int | None
```

Generated TypeScript:

```ts
export enum Role {
    ADMIN = "ADMIN",
}

export interface User {
    id: number;
    name: string;
    role: Role;
    age?: number | null;
}
```

### Contributing

PRs welcome. Please run lint and unit tests before submitting.
