import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * Shared MSW server for Node-based tests.
 *
 * Lifecycle is wired in `src/test/setup.ts`: listen before all tests,
 * reset handlers between tests, close when done.
 */
export const server = setupServer(...handlers);
