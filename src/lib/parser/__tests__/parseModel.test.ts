import { describe, it, expect } from "vitest";
import { parseModelsFromSource } from "../parseModel";

describe("parseModelsFromSource", () => {
    it("parses a simple BaseModel with required and optional fields", () => {
        const src = `
class User(BaseModel):
    id: UUID
    name: str
    age: int | None
    tags: list[str] = []
    nickname: Optional[str] = None
`;
        const { models, diagnostics } = parseModelsFromSource(src);
        expect(diagnostics.length).toBe(0);
        expect(models.length).toBe(1);
        const m = models[0]!;
        expect(m.name).toBe("User");
        const fields = Object.fromEntries(m.fields.map((f) => [f.name, f]));
        expect(fields["id"]?.isOptional).toBe(false);
        expect(fields["name"]?.isOptional).toBe(false);
        expect(fields["age"]?.isOptional).toBe(true);
        expect(fields["tags"]?.isOptional).toBe(false);
        expect(fields["nickname"]?.isOptional).toBe(true);
    });

    it("ignores defaults for types and optionality (unless None)", () => {
        const src = `
class Settings(BaseModel):
    theme: str = "dark"
    volume: int = 50
`;
        const { models } = parseModelsFromSource(src);
        const m = models[0]!;
        const fields = Object.fromEntries(m.fields.map((f) => [f.name, f]));
        expect(fields["theme"]?.isOptional).toBe(false);
        expect(fields["volume"]?.isOptional).toBe(false);
    });

    it("parses Field alias and stores it on the field", () => {
        const src = `
class Product(BaseModel):
    product_id: int = Field(..., alias="id")
    product_name: str = Field(alias='name')
`;
        const { models } = parseModelsFromSource(src);
        const m = models[0]!;
        const byOrig = Object.fromEntries(m.fields.map((f) => [f.name, f]));
        expect(byOrig["product_id"]?.alias).toBe("id");
        expect(byOrig["product_name"]?.alias).toBe("name");
    });

    it("supports pydantic constrained types without changing TS base type", () => {
        const src = `
class Constraints(BaseModel):
    age: conint(ge=0, le=120)
    code: constr(min_length=2, max_length=5)
`;
        const { models } = parseModelsFromSource(src);
        expect(models.length).toBe(1);
        const m = models[0]!;
        const fields = Object.fromEntries(m.fields.map((f) => [f.name, f]));
        expect(fields["age"]?.type).toEqual({ kind: "primitive", name: "int" });
        expect(fields["code"]?.type).toEqual({
            kind: "primitive",
            name: "str",
        });
    });
});
