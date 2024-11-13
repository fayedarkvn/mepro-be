import js from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
import checkFile from 'eslint-plugin-check-file';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'eol-last': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'comma-dangle': ['error', 'always-multiline'],
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
    ignores: ['node_modules/**/*', 'dist/**/*'],
  },
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**/*', 'dist/**/*'],
  },
);