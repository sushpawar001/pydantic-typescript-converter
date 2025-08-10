"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <button
            className="btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (
                <Sun aria-hidden="true" />
            ) : (
                <Moon aria-hidden="true" />
            )}
            <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
        </button>
    );
}
