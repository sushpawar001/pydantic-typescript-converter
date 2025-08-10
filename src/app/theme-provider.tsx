"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="theme-dark"
            enableSystem={false}
            disableTransitionOnChange
            value={{ light: "theme-light", dark: "theme-dark" }}
        >
            {children}
        </NextThemesProvider>
    );
}
