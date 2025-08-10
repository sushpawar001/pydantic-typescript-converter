import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.{test,spec}.ts", "src/**/*.{test,spec}.tsx"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            all: true,
            include: ["src/lib/**"],
        },
    },
});
