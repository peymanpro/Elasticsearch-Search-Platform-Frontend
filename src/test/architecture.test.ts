// @vitest-environment node
/// <reference types="node" />

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');

describe('architecture', () => {
  it('has no dependency-cruiser violations', () => {
    const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    let output = '';
    let failed = false;

    try {
      output = execFileSync(pnpm, ['arch'], {
        cwd: repoRoot,
        encoding: 'utf8',
        shell: true,
      });
    } catch (err) {
      failed = true;
      const e = err as { stdout?: string; stderr?: string };
      output = `${e.stdout ?? ''}\\n${e.stderr ?? ''}`;
    }

    expect(failed, output).toBe(false);
  }, 60_000);
});
