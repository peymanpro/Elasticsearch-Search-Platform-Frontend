import { useState } from 'react';

import type { ScoreExplanation } from '@/shared/api/schemas/explain';
import { cn } from '@/shared/lib/cn';
import { ChevronRightIcon } from '@/shared/ui/icons';

interface ExplanationTreeProps {
  root: ScoreExplanation;
  /** Nodes at depth < defaultOpenDepth start expanded. */
  defaultOpenDepth?: number;
}

/**
 * Recursive view of the scoring explanation tree.
 *
 * Every node shows its own score and the description Elasticsearch
 * produced. Nodes with children can be expanded. The root and its
 * direct children are open by default; deeper levels are collapsed so
 * a large explanation is scannable.
 */
export function ExplanationTree({ root, defaultOpenDepth = 1 }: ExplanationTreeProps) {
  return (
    <ul className="flex flex-col gap-1" aria-label="Score explanation">
      <ExplanationNode node={root} depth={0} defaultOpenDepth={defaultOpenDepth} />
    </ul>
  );
}

interface ExplanationNodeProps {
  node: ScoreExplanation;
  depth: number;
  defaultOpenDepth: number;
}

function ExplanationNode({ node, depth, defaultOpenDepth }: ExplanationNodeProps) {
  const hasChildren = node.details.length > 0;
  const [open, setOpen] = useState(depth < defaultOpenDepth);

  return (
    <li>
      <div className="flex items-start gap-2">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse' : 'Expand'}
            className={cn(
              'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
              'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-fg)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
            )}
          >
            <ChevronRightIcon
              width={12}
              height={12}
              className={cn('transition-transform', open && 'rotate-90')}
            />
          </button>
        ) : (
          <span aria-hidden="true" className="mt-0.5 inline-block h-5 w-5 shrink-0" />
        )}

        <span
          className="mt-0.5 inline-flex h-5 shrink-0 items-center rounded-[var(--radius-sm)] bg-[var(--color-accent-muted)] px-2 font-mono text-xs tabular-nums text-[var(--color-fg)]"
          title={`Score contribution: ${node.value}`}
        >
          {formatScore(node.value)}
        </span>

        <span className="min-w-0 flex-1 break-words text-sm text-[var(--color-fg-muted)]">
          {node.description}
        </span>
      </div>

      {hasChildren && open ? (
        <ul
          className="ml-2 mt-1 flex flex-col gap-1 border-l border-[var(--color-border)] pl-3"
          aria-label="Child score contributions"
        >
          {node.details.map((child, index) => (
            <ExplanationNode
              key={index}
              node={child}
              depth={depth + 1}
              defaultOpenDepth={defaultOpenDepth}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function formatScore(value: number): string {
  // Locale-independent format: always two decimals, "." as separator.
  // Using toFixed avoids relying on the host machine's number format.
  return value.toFixed(2);
}
