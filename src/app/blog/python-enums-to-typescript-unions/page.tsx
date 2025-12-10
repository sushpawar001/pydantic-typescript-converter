import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { blogPosts, blogList } from "../posts";

const post = blogPosts.enums;
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

export default function PythonEnumsToTypescriptUnionsPage() {
    return (
        <div className="page">
            <Header />
            <section className="blog-hero">
                <p className="kicker">Blog</p>
                <h1 className="title">
                    How to convert Python Enums into TypeScript string unions
                    automatically
                </h1>
                <p className="subtitle">
                    Keep Python Enum and IntEnum members perfectly mirrored as
                    TypeScript string unions. Stop copy-pasting names, guessing
                    values, and letting the frontend drift.
                </p>
                <div className="blog-meta">
                    <span className="pill">Enums</span>
                    <span className="pill">TypeScript Unions</span>
                    <span>{post.readTime}</span>
                </div>
                <div className="actions">
                    <Link className="btn btn-primary" href="/">
                        Use the converter
                    </Link>
                    <Link className="btn" href={blogPosts.annotations.slug}>
                        Map optionals & unions
                    </Link>
                </div>
            </section>

            <article className="blog-article">
                <p>
                    You know the feeling: you just want to convert Python Enums
                    into TypeScript string unions automatically, but instead you
                    are copy-pasting names, guessing literal values, and hoping
                    you did not miss a member. A backend enum drifts and the
                    frontend rejects or accepts the wrong values. Here is how to
                    stop the churn and keep Enum and IntEnum members in sync.
                </p>

                <h2>The pain</h2>
                <ul>
                    <li>
                        Adding a new Python member but forgetting to mirror it
                        in TypeScript.
                    </li>
                    <li>
                        Renames and aliases that go out of sync, causing subtle
                        runtime failures.
                    </li>
                    <li>
                        IntEnum values treated as numbers on the frontend,
                        widening the accepted inputs.
                    </li>
                    <li>
                        Manual casing changes (camel vs snake) that do not match
                        team standards.
                    </li>
                </ul>

                <h2>The fix</h2>
                <p>
                    Paste or upload your Python enums into the client-only
                    converter. It walks each <code>Enum</code>/<code>IntEnum</code>,
                    extracts member names and string values, respects aliases,
                    and emits TypeScript unions that mirror the source. Toggle
                    camelCase if you want JS-style identifiers; keep snake_case
                    otherwise. The goal: Python stays the single source of
                    truth, while the frontend gets the exact allowed strings.
                </p>

                <h2>The steps</h2>
                <ol>
                    <li>
                        <strong>Pick the enums.</strong> Grab the{" "}
                        <code>.py</code> file with your <code>Enum</code> or{" "}
                        <code>IntEnum</code> classes.
                    </li>
                    <li>
                        <strong>Paste or upload.</strong> Drop the definitions
                        into the site; include referenced enums that live
                        nearby.
                    </li>
                    <li>
                        <strong>Choose casing and comments.</strong> CamelCase
                        or snake_case output; optional docstrings as TS
                        comments.
                    </li>
                    <li>
                        <strong>Generate.</strong> The site emits unions like{" "}
                        <code>&quot;PENDING&quot; | &quot;ACTIVE&quot; | &quot;DISABLED&quot;</code> that match
                        your members (IntEnum still surfaces string member
                        names).
                    </li>
                    <li>
                        <strong>Drop into your repo.</strong> Copy into your{" "}
                        <code>types/</code> folder or pipe to a <code>.ts</code>{" "}
                        file.
                    </li>
                    <li>
                        <strong>Keep it in sync.</strong> Rerun on every enum
                        change or wire it to a pre-commit/CI hook.
                    </li>
                </ol>

                <h2>Example input and output</h2>
                <pre className="codeblock blog-code" aria-label="Enum example">
{`from enum import Enum

class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    DISABLED = "disabled"`}
                </pre>
                <p>Generates:</p>
                <pre className="codeblock blog-code" aria-label="TypeScript union">
{`export type Status = "pending" | "active" | "disabled";`}
                </pre>
                <p>
                    Add a new member and regenerate—the union updates instantly,
                    no hunting through TS files.
                </p>

                <h2>Quick example to try</h2>
                <pre className="codeblock blog-code" aria-label="Enum and IntEnum example">
{`from enum import Enum, IntEnum


class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    DISABLED = "disabled"


class Priority(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3`}
                </pre>
                <p>
                    Generate to get unions such as{" "}
                    <code>&quot;pending&quot; | &quot;active&quot; | &quot;disabled&quot;</code> and{" "}
                    <code>&quot;LOW&quot; | &quot;MEDIUM&quot; | &quot;HIGH&quot;</code> (IntEnum surfaced as
                    strings to keep the frontend constrained). Toggle camelCase
                    vs snake_case without touching Python.
                </p>

                <h2>Tips that keep things smooth</h2>
                <ul>
                    <li>
                        Keep enums near the models that use them so you can
                        paste both when needed.
                    </li>
                    <li>
                        Prefer string unions in TS even for IntEnum to avoid
                        number/string mismatches.
                    </li>
                    <li>
                        Standardize casing per project; camelCase matches most
                        JS codebases, but snake_case is fine if that is your
                        team’s norm.
                    </li>
                    <li>
                        Store generated unions in source control so reviewers see
                        contract changes.
                    </li>
                    <li>
                        Add regeneration to your PR checklist or a tiny script;
                        it takes seconds and avoids late bugs.
                    </li>
                </ul>

                <h2>Wrap-up</h2>
                <p>
                    Keeping enums aligned across Python and TypeScript should
                    not be recurring busywork. Paste or upload, pick casing,
                    generate, and drop the output into your repo. Do that
                    whenever enums change and you will avoid the drift that
                    causes subtle frontend bugs.
                </p>
                <div className="actions" style={{ marginTop: 14 }}>
                    <Link className="btn btn-primary" href="/">
                        Generate enum unions
                    </Link>
                    <Link className="btn" href={blogPosts.basemodels.slug}>
                        Turn BaseModels into interfaces
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

