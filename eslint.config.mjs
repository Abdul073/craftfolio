import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignorePatterns: [
      "node_modules/**",
      ".next/**",
      "lib/generated/**", // Ignore Prisma generated files
      "**/*.d.ts"
    ]
  }
];

export default eslintConfig;