import React from "react";
import { Layers3, Clock, List, Shield } from "lucide-react";

export function FeaturesSection() {
    return (
        <section className="features">
            <div className="feature">
                <div className="icon">
                    <Layers3 aria-hidden="true" />
                </div>
                <h4>Accurate type mapping</h4>
                <p>
                    Optional, Union, Literal, Enum, nested models, lists, dicts.
                </p>
            </div>
            <div className="feature">
                <div className="icon">
                    <Clock aria-hidden="true" />
                </div>
                <h4>Fast & private</h4>
                <p>Runs entirely in your browser—ideal for sensitive code.</p>
            </div>
            <div className="feature">
                <div className="icon">
                    <List aria-hidden="true" />
                </div>
                <h4>Naming strategy</h4>
                <p>Keep snake_case or output camelCase; preserve aliases.</p>
            </div>
            <div className="feature">
                <div className="icon">
                    <Shield aria-hidden="true" />
                </div>
                <h4>Developer‑ready</h4>
                <p>Copy to clipboard, download .ts, and Prettier format.</p>
            </div>
        </section>
    );
}
