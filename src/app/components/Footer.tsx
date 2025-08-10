import React from "react";
import { Coffee, Github, Linkedin, MessageSquarePlus } from "lucide-react";

type FooterProps = {
    className?: string;
    style?: React.CSSProperties;
};

export function Footer({ className, style }: FooterProps) {
    return (
        <footer
            className={`footer${className ? ` ${className}` : ""}`}
            style={style}
        >
            <div className="mini">
                Convert Pydantic models to TypeScript—fast, accurate, and
                private.
            </div>
            <div className="mini">
                <a
                    className="btn btn-sm"
                    href="https://buymeacoffee.com/sushpawar"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Coffee aria-hidden="true" />
                    <span>Buy me a coffee</span>
                </a>
                <a
                    className="btn btn-sm"
                    href="https://github.com/sushpawar001/pydantic-typescript-converter"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Github aria-hidden="true" />
                    <span>GitHub</span>
                </a>
                <a
                    className="btn btn-sm"
                    href="https://github.com/sushpawar001/pydantic-typescript-converter/issues"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <MessageSquarePlus aria-hidden="true" />
                    <span>Feature request</span>
                </a>
                <a
                    className="btn btn-sm"
                    href="https://www.linkedin.com/in/sushant-pawar-b85a79260/"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Linkedin aria-hidden="true" />
                    <span>LinkedIn</span>
                </a>
            </div>
        </footer>
    );
}
