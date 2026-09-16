import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sharedForbiddenPatterns = [
  {
    group: ['@/features/*', '@/routes/*', '@/app/*'],
    message: 'src/shared must not import from features, routes, or app.',
  },
];

const featureForbiddenPatterns = [
  {
    group: ['@/routes/*', '@/app/*'],
    message: 'Features must not import from routes or app.',
  },
];

const routeForbiddenPatterns = [
  {
    group: ['@/app/*'],
    message: 'Routes must not import from app.',
  },
];

const featureNames = ['search', 'autocomplete', 'filters', 'explain', 'health'];

const featureOverrides = featureNames.map((name) => {
  const others = featureNames.filter((n) => n !== name).map((n) => `@/features/${n}/*`);
  return {
    files: [`src/features/${name}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...featureForbiddenPatterns,
            {
              group: others,
              message: `The "${name}" feature must not import another feature.`,
            },
          ],
        },
      ],
    },
  };
});

export default tseslint.config(
  {
    ignores: ['dist', 'coverage', 'node_modules', 'playwright-report', 'test-results'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: sharedForbiddenPatterns }],
    },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: routeForbiddenPatterns }],
    },
  },
  ...featureOverrides,

  {
    files: ['src/routes/**/*.{ts,tsx}', 'src/routeTree.gen.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
