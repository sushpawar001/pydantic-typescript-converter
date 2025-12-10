import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { blogPosts, blogList } from "../posts";

const post = blogPosts.annotations;
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

export default function PythonAnnotationsToTypescriptPage() {
    return (
        <div className="page">
            <Header />
            <section className="blog-hero">
                <p className="kicker">Blog</p>
                <h1 className="title">
                    How to map Optional, Union, Literal, list, dict, and tuple
                    annotations to TypeScript types
                </h1>
                <p className="subtitle">
                    Stop guessing whether optionals are nullable, unions stay
                    narrow, or tuples keep their shape. Paste your Pydantic
                    models and ship TypeScript that mirrors Python.
                </p>
                <div className="blog-meta">
                    <span className="pill">Pydantic → TypeScript</span>
                    <span className="pill">Typesafety</span>
                    <span>{post.readTime}</span>
                </div>
                <div className="actions">
                    <Link className="btn btn-primary" href="/">
                        Use the converter
                    </Link>
                    <Link className="btn" href={blogPosts.basemodels.slug}>
                        BaseModel to TS guide
                    </Link>
                </div>
            </section>

            <article className="blog-article">
                <p>
                    You and I both know the pain of mapping Optional, Union,
                    Literal, list, dict, and tuple annotations to TypeScript
                    without breaking downstream consumers. A Pydantic model
                    changes and suddenly the frontend is guessing whether{" "}
                    <code>None</code> is allowed, whether tuples are fixed
                    length, or whether a <code>Literal</code> should widen. This
                    walkthrough shows the pain points, how the in-browser
                    converter fixes them, and the repeatable steps to keep your
                    Python and TypeScript in lockstep.
                </p>

                <h2>The pain</h2>
                <ul>
                    <li>
                        Optionals should be nullable + optional (
                        <code>?: T | null</code>) but drift into plain{" "}
                        <code>T</code>.
                    </li>
                    <li>
                        Union shapes collapse into <code>any</code> during a
                        crunch.
                    </li>
                    <li>
                        Literals lose specificity, so editors stop hinting and
                        reviewers miss regressions.
                    </li>
                    <li>
                        Lists/dicts widen to <code>any[]</code> or{" "}
                        <code>{"{ [key: string]: any }"}</code>, hiding typos
                        until runtime.
                    </li>
                    <li>
                        Tuples quietly become arrays, letting callers push extra
                        items without TypeScript complaining.
                    </li>
                </ul>

                <div className="blog-callout">
                    The result is drift: TypeScript stops reflecting reality,
                    QA opens bug tickets, and you diff Python vs TypeScript by
                    hand. It is tedious, repetitive, and easy to mess up.
                </div>

                <h2>The fix</h2>
                <p>
                    The client-only converter parses Python 3.11+ Pydantic
                    models (and Enums) directly in your browser and emits
                    matching TypeScript. It already understands the shapes you
                    care about:
                </p>
                <ul>
                    <li>
                        <strong>Optionals</strong>: <code>Optional[T]</code> and{" "}
                        <code>T | None</code> → <code>?: T | null</code>.
                    </li>
                    <li>
                        <strong>Unions</strong>: <code>Union</code> and{" "}
                        <code>|</code> become TypeScript unions, preserving every
                        branch.
                    </li>
                    <li>
                        <strong>Literals</strong>: <code>Literal[...]</code>{" "}
                        turns into string/number literal unions.
                    </li>
                    <li>
                        <strong>Lists</strong>: <code>list[T]</code> →{" "}
                        <code>T[]</code> (nested lists stay nested).
                    </li>
                    <li>
                        <strong>Dicts</strong>: <code>dict[K, V]</code> →{" "}
                        <code>Record&lt;K, V&gt;</code> for string keys, with
                        index signatures as a safe fallback.
                    </li>
                    <li>
                        <strong>Tuples</strong>: fixed-length tuples stay fixed;
                        <code>tuple[T, ...]</code> stays variadic.
                    </li>
                </ul>
                <p>
                    Because it runs locally, you can iterate quickly and rely on
                    diagnostics instead of silent mis-maps.
                </p>

                <h2>The steps</h2>
                <ol>
                    <li>
                        <strong>Gather the models.</strong> Open the{" "}
                        <code>.py</code> file with the BaseModel classes and any
                        referenced enums or helper types.
                    </li>
                    <li>
                        <strong>Paste into the site.</strong> Drop the code into
                        the editor—nothing leaves your machine.
                    </li>
                    <li>
                        <strong>Generate TypeScript.</strong> Optionals become{" "}
                        <code>?: T | null</code>, unions stay unions, literals
                        stay narrow, lists/dicts/tuples keep their shapes.
                    </li>
                    <li>
                        <strong>Review the hotspots.</strong> Confirm nullable
                        optionals, union branches, literal narrowness, and tuple
                        shapes. Unsupported constructs surface diagnostics.
                    </li>
                    <li>
                        <strong>Copy or download.</strong> Copy to clipboard or
                        download the <code>.ts</code> file into your shared
                        types folder.
                    </li>
                    <li>
                        <strong>Re-run when Python changes.</strong> Any time a
                        field or tuple changes, regenerate to keep drift at
                        zero.
                    </li>
                </ol>

                <h2>What the mapping looks like</h2>
                <ul>
                    <li>
                        <code>age: int | None</code> → <code>age?: number | null</code>
                    </li>
                    <li>
                        <code>role: Literal[&quot;guest&quot;, &quot;member&quot;, &quot;admin&quot;]</code>{" "}
                        → <code>&quot;guest&quot; | &quot;member&quot; | &quot;admin&quot;</code>
                    </li>
                    <li>
                        <code>tags: list[str]</code> → <code>string[]</code>
                    </li>
                    <li>
                        <code>preferences: dict[str, Literal[&quot;light&quot;, &quot;dark&quot;]]</code>{" "}
                        → <code>Record&lt;string, &quot;light&quot; | &quot;dark&quot;&gt;</code>
                    </li>
                    <li>
                        <code>position: tuple[int, int]</code> →{" "}
                        <code>[number, number]</code>
                    </li>
                    <li>
                        <code>history: list[tuple[int, Literal[&quot;draft&quot;, &quot;live&quot;]]]</code>{" "}
                        → <code>[number, &quot;draft&quot; | &quot;live&quot;][]</code>
                    </li>
                </ul>

                <h2>Quick example to try</h2>
                <p>
                    Paste this snippet into the generator to see optionals,
                    unions, literals, lists, dicts, and tuples map cleanly:
                </p>
                <pre className="codeblock blog-code" aria-label="Python example">
{`from enum import Enum
from typing import Literal, Optional
from pydantic import BaseModel


class Role(Enum):
    GUEST = "guest"
    MEMBER = "member"
    ADMIN = "admin"


class Profile(BaseModel):
    role: Literal["guest", "member", "admin"]
    status: Literal["draft", "live"]
    tags: list[str]
    preferences: dict[str, Literal["light", "dark"]]
    position: tuple[int, int]
    note: Optional[str]
    reviewer: Role | None
    history: list[tuple[int, Literal["draft", "live"]]]`}
                </pre>
                <p>
                    Generate and you will see the TypeScript surface nullable
                    optionals, narrow literals, typed records, tuple shapes, and
                    nested collections without widening to <code>any</code>.
                </p>

                <h2>Practical tips</h2>
                <ul>
                    <li>Keep Python as the source of truth; regenerate instead of editing TS by hand.</li>
                    <li>
                        Paste related models and enums together so references
                        resolve cleanly.
                    </li>
                    <li>
                        If you mix string and number literals, confirm unions
                        stay narrow instead of widening to <code>string</code>{" "}
                        or <code>number</code>.
                    </li>
                    <li>
                        Store generated files in source control so reviewers see
                        contract updates.
                    </li>
                    <li>
                        When you add a tuple, double-check whether it should be
                        fixed length; TypeScript will keep what Python declared.
                    </li>
                    <li>
                        Unsupported constructs emit diagnostics—decide whether
                        to refactor Python or accept a safe <code>any</code>/
                        <code>unknown</code> fallback.
                    </li>
                </ul>

                <h2>Wrap-up</h2>
                <p>
                    Mapping Optional, Union, Literal, list, dict, and tuple
                    annotations to TypeScript does not have to be a chore. Paste
                    your Pydantic models into the client-only converter, review,
                    copy, and repeat whenever Python changes. You get interfaces
                    and enums that mirror reality: optionals stay nullable,
                    unions stay unions, literals stay narrow, collections stay
                    typed, and tuples keep their shape.
                </p>
                <div className="actions" style={{ marginTop: 14 }}>
                    <Link className="btn btn-primary" href="/">
                        Generate my TypeScript types
                    </Link>
                    <Link className="btn" href={blogPosts.enums.slug}>
                        See the Enum → union flow
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

