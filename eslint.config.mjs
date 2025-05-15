import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/.d2/**",
      "dist/**",
      ".eslintcache/**",
      "**/chap-lib/src/httpfunctions/**",
      "**/*.{js,jsx}"
    ]
  },
  { files: ["packages/**/*.{ts,tsx,mts,cts}"], languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: config.files ? config.files.map(fileGlob => `packages/${fileGlob}`) : ["packages/**/*.{ts,tsx,mts,cts}"],
  })),
  {
    files: ["packages/**/*.{ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
  {
    files: ["packages/**/*.{ts,tsx}"],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "18.3.1"
      }
    }
  },
  /* // Temporarily removing CSS parsing configuration
  {
    // Spread the recommended configuration from the @eslint/css plugin.
    // This typically includes the correct parser and recommended rules for CSS files.
    // ...css.configs.recommended, // Previous attempt
    ...css.configs.all, // Trying 'all' to ensure parser is included
    // Ensure this configuration applies specifically to your CSS files.
    // This overrides any 'files' glob that might be present in 'css.configs.recommended'.
    files: ["packages/**\*.css"],
  }
  */
]);
