import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: [
      "apps/**",
      "packages/**",
      "e2e/**",
      "node_modules/**",
      "dist/**",
      ".turbo/**",
    ],
  },
];
