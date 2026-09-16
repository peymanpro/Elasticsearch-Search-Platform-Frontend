import { Fragment } from 'react';

interface HighlightProps {
  /** A single fragment returned by Elasticsearch, possibly containing <em> tags. */
  value: string;
}

type Segment = { text: string; emphasized: boolean };

/**
 * Split an Elasticsearch highlight fragment into a plain sequence of
 * segments, where only the <em>...</em> markers are honored.
 *
 * The backend produces fragments with <em> around matched terms and
 * escapes all other markup. Re-parsing with this narrow rule means an
 * embedded <script> in a document field is displayed as text, not
 * executed. No HTML is ever injected into the DOM.
 */
function parseHighlight(value: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const open = value.indexOf('<em>', cursor);
    if (open === -1) {
      segments.push({ text: value.slice(cursor), emphasized: false });
      break;
    }
    const close = value.indexOf('</em>', open + 4);
    if (close === -1) {
      segments.push({ text: value.slice(cursor), emphasized: false });
      break;
    }
    if (open > cursor) {
      segments.push({ text: value.slice(cursor, open), emphasized: false });
    }
    segments.push({ text: value.slice(open + 4, close), emphasized: true });
    cursor = close + 5;
  }

  return segments;
}

/**
 * Render an Elasticsearch highlight fragment safely.
 *
 * Only <em>...</em> markers are interpreted; every other character is
 * rendered as plain text. Emphasis is applied with a <mark> element,
 * which carries the semantic meaning.
 */
export function Highlight({ value }: HighlightProps) {
  const segments = parseHighlight(value);
  return (
    <>
      {segments.map((segment, index) =>
        segment.emphasized ? (
          <mark
            key={index}
            className="rounded-[var(--radius-sm)] bg-[var(--color-accent-muted)] px-0.5 text-[var(--color-fg)]"
          >
            {segment.text}
          </mark>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}
