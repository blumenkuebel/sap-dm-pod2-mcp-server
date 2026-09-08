import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "docu/**", "examples/**", "usage/**", "scripts/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Embedded shell snippets in prompt templates defensively escape `$`; the
    // escapes are output-neutral inside template literals, so the stylistic rule
    // is noise here.
    files: ["src/prompts/generators.ts"],
    rules: { "no-useless-escape": "off" },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: { process: "readonly", Buffer: "readonly", console: "readonly" },
    },
  },
);
