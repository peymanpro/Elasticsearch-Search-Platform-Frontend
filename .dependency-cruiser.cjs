/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies are not allowed anywhere in the codebase.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Orphan modules are files nobody imports and that import nobody.',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|jsx|ts|tsx|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)(vitest|vite|eslint|dependency-cruiser)\\.config\\.[cm]?[jt]s$',
          '^src/main\\.tsx$',
          '^src/vite-env\\.d\\.ts$',
          '^src/test/setup\\.ts$',
          '\\.test\\.(ts|tsx)$',
          '\\.spec\\.(ts|tsx)$',
        ],
      },
      to: {},
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      comment: 'Do not import modules that cannot be resolved (except ambient types).',
      from: { pathNot: '\\.d\\.ts$' },
      to: {
        couldNotResolve: true,
        pathNot: ['^node$', '^node:', '^vite/client$'],
      },
    },
    {
      name: 'no-dev-dep-in-src',
      severity: 'error',
      comment: 'Production code in src must not import devDependencies.',
      from: {
        path: '^src/',
        pathNot: ['\\.test\\.(ts|tsx)$', '\\.spec\\.(ts|tsx)$', '^src/test/'],
      },
      to: { dependencyTypes: ['npm-dev'] },
    },
    {
      name: 'shared-not-to-features-routes-app',
      severity: 'error',
      comment: 'src/shared must not import from features, routes, or app.',
      from: { path: '^src/shared/' },
      to: { path: '^src/(features|routes|app)/' },
    },
    {
      name: 'feature-isolation',
      severity: 'error',
      comment: 'A feature must not import another feature.',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/([^/]+)/',
        pathNot: '^src/features/$1/',
      },
    },
    {
      name: 'routes-not-to-app',
      severity: 'error',
      comment: 'Routes must not import app (app is the top layer).',
      from: { path: '^src/routes/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'features-not-to-app-or-routes',
      severity: 'error',
      comment: 'Features must not import app or routes.',
      from: { path: '^src/features/' },
      to: { path: '^src/(app|routes)/' },
    },
    {
      name: 'production-not-to-test',
      severity: 'error',
      comment: 'Production code (non-test files) must not import from src/test.',
      from: {
        path: '^src/',
        pathNot: ['^src/test/', '\\.test\\.(ts|tsx)$', '\\.spec\\.(ts|tsx)$'],
      },
      to: { path: '^src/test/' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mjs', '.cjs'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
