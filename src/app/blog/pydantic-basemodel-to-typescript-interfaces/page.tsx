import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { blogPosts, blogList } from "../posts";

const post = blogPosts.basemodels;
const related = blogList.filter((item) => item.slug !== post.slug);

export const metadata: Metadata = {
    title: post.title,
    description: post.description,
    alternates: {
        canonical: post.slug,
    },
    openGraph: {
        title: post.title,
        description: post.description,
        url: post.slug,
    },
};

export default function PydanticBasemodelToTypescriptInterfacesPage() {
    return (
        <div className="page">
            <Header />
            <section className="blog-hero">
                <p className="kicker">Blog</p>
                <h1 className="title">
                    How to turn Pydantic BaseModel files into TypeScript
                    interfaces
                </h1>
                <p className="subtitle">
                    Stop hand-translating Pydantic models. Paste your Python
                    file, pick options, and ship TypeScript interfaces that stay
                    in sync—optionals, unions, literals, enums, defaults, and
                    nested models included.
                </p>
                <div className="blog-meta">
                    <span className="pill">Pydantic</span>
                    <span className="pill">TypeScript Interfaces</span>
                    <span>{post.readTime}</span>
                </div>
                <div className="actions">
                    <Link className="btn btn-primary" href="/">
                        Use the converter
                    </Link>
                    <Link className="btn" href={blogPosts.annotations.slug}>
                        See type mapping tips
                    </Link>
                </div>
            </section>

            <article className="blog-article">
                <p>
                    You have probably hit the wall where Python models live in
                    Pydantic but your frontend wants TypeScript types. The manual
                    workflow—copying fields, missing camelCase vs snake_case, and
                    shipping mismatches—leads to runtime bugs. Here is a repeatable
                    way to turn BaseModel files into TypeScript interfaces without
                    the grind.
                </p>

                <h2>The pain</h2>
                <ul>
                    <li>
                        Optional fields change in Python but never reach the TS
                        interface, so type checks miss real-world inputs.
                    </li>
                    <li>
                        Nested models and enums are easy to mistype when copied by
                        hand.
                    </li>
                    <li>
                        Dual maintenance steals time and still leaves drift.
                    </li>
                </ul>

                <h2>The fix</h2>
                <p>
                    The client-only site parses your Pydantic BaseModel files and
                    emits matching TypeScript interfaces. It keeps optionality,
                    unions, literal choices, default values, nested objects, and
                    enums aligned. You pick whether to output interfaces or types,
                    camelCase or snake_case, and whether to include docstrings as
                    comments.
                </p>

                <h2>The steps</h2>
                <ol>
                    <li>
                        <strong>Gather your models.</strong> Point the tool at the
                        <code>.py</code> file that holds your BaseModel definitions
                        (include referenced enums).
                    </li>
                    <li>
                        <strong>Paste or upload.</strong> Drop the code into the
                        site—everything runs locally.
                    </li>
                    <li>
                        <strong>Pick output options.</strong> Interfaces or types,
                        camelCase or snake_case, comments on or off.
                    </li>
                    <li>
                        <strong>Generate.</strong> Get TypeScript that mirrors your
                        schema: optionals, unions, literals, enums, nested models,
                        defaults.
                    </li>
                    <li>
                        <strong>Drop into your app.</strong> Copy into{" "}
                        <code>types/</code> or save to a <code>.ts</code> file and
                        import where needed.
                    </li>
                    <li>
                        <strong>Keep it in sync.</strong> Re-run whenever Python
                        changes; automate in CI or a small script if you like.
                    </li>
                </ol>

                <h2>Example flow</h2>
                <pre className="codeblock blog-code" aria-label="Pydantic model example">
{`class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Literal["admin", "member"]
    profile: "Profile" | None = None`}
                </pre>
                <p>
                    Choose interfaces + camelCase and you will see something like:
                </p>
                <pre className="codeblock blog-code" aria-label="TypeScript interface example">
{`export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  profile?: Profile | null;
}`}
                </pre>

                <h2>Why this beats hand-rolling</h2>
                <ul>
                    <li>You stop missing fields—optional markers stay aligned.</li>
                    <li>
                        Enums and literals stay narrow unions instead of widening to
                        <code>string</code>.
                    </li>
                    <li>
                        Nested models and lists become proper nested interfaces, not
                        guesses.
                    </li>
                    <li>
                        Comments can follow along for better editor tooltips.
                    </li>
                    <li>It is repeatable—regenerate after every Python tweak.</li>
                </ul>

                <h2>Tips for smoother usage</h2>
                <ul>
                    <li>Group related models when generating so references resolve together.</li>
                    <li>Keep enums close to the models that use them.</li>
                    <li>
                        Pick camelCase if your frontend prefers it; keep snake_case if that
                        matches your API contract.
                    </li>
                    <li>
                        Add regeneration to your PR checklist and commit the generated file
                        so reviewers see contract changes.
                    </li>
                </ul>

                <h2>Wrap-up</h2>
                <p>
                    Drift between Pydantic models and TypeScript interfaces is avoidable.
                    Paste, pick options, generate, and drop the output into your frontend.
                    Repeat whenever models change and enjoy zero-guesswork types.
                </p>
                <div className="actions" style={{ marginTop: 14 }}>
                    <Link className="btn btn-primary" href="/">
                        Generate interfaces now
                    </Link>
                    <Link className="btn" href={blogPosts.enums.slug}>
                        Convert enums to unions
                    </Link>
                </div>
            </article>

            <section className="blog-related">
                <h3>Related reading</h3>
                <div className="blog-related-grid">
                    {related.map((item) => (
                        <Link key={item.slug} href={item.slug} className="blog-card">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                            <p style={{ marginTop: 6, fontWeight: 700 }}>{item.readTime}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

