export type BlogPostMeta = {
    slug: string;
    title: string;
    description: string;
    readTime: string;
};

export const blogPosts: Record<string, BlogPostMeta> = {
    annotations: {
        slug: "/blog/python-annotations-to-typescript-types",
        title: "How to map Optional, Union, Literal, list, dict, and tuple annotations to TypeScript types",
        description:
            "Turn tricky Optional, Union, Literal, list, dict, and tuple annotations into accurate TypeScript output without hand-mapping every change.",
        readTime: "7 min read",
    },
    enums: {
        slug: "/blog/python-enums-to-typescript-unions",
        title: "How to convert Python Enums into TypeScript string unions automatically",
        description:
            "Mirror Python Enum and IntEnum members as string unions in TypeScript so your frontend never drifts from backend truth.",
        readTime: "5 min read",
    },
    basemodels: {
        slug: "/blog/pydantic-basemodel-to-typescript-interfaces",
        title: "How to turn Pydantic BaseModel files into TypeScript interfaces",
        description:
            "Generate TypeScript interfaces straight from your Pydantic BaseModel files and keep optionality, literals, and nested models in sync.",
        readTime: "6 min read",
    },
};

export const blogList = Object.values(blogPosts);
