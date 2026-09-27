// @ts-check

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["src/**/*.{tsx,ts}"],
  extends: [js.configs.recommended, tseslint.configs.recommended],
  rules: {
    "no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "no-undef": "off",
    "no-console": "off",
  },
});
