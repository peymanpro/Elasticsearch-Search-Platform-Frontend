import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Highlight } from './highlight';

describe('Highlight', () => {
  it('renders plain text when there are no markers', () => {
    render(<Highlight value="wireless headphones" />);
    expect(screen.getByText('wireless headphones')).toBeInTheDocument();
  });

  it('renders a single <em> segment as <mark>', () => {
    const { container } = render(<Highlight value="<em>wireless</em> headphones" />);
    const mark = container.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark).toHaveTextContent('wireless');
  });

  it('renders multiple <em> segments', () => {
    const { container } = render(
      <Highlight value="<em>wireless</em> noise-cancelling <em>headphones</em>" />,
    );
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(2);
    expect(marks[0]).toHaveTextContent('wireless');
    expect(marks[1]).toHaveTextContent('headphones');
  });

  it('preserves the surrounding plain text', () => {
    const { container } = render(<Highlight value="buy <em>wireless</em> today" />);
    expect(container.textContent).toBe('buy wireless today');
  });

  it('does not interpret <script> as HTML', () => {
    const { container } = render(<Highlight value="<script>alert('xss')</script>" />);
    // No actual script element rendered
    expect(container.querySelector('script')).toBeNull();
    // The literal text is displayed
    expect(container.textContent).toContain("<script>alert('xss')</script>");
  });

  it('does not interpret other HTML tags as markup', () => {
    const { container } = render(<Highlight value="<strong>important</strong>" />);
    expect(container.querySelector('strong')).toBeNull();
    expect(container.textContent).toBe('<strong>important</strong>');
  });

  it('handles an unmatched <em> as plain text', () => {
    const { container } = render(<Highlight value="before <em>after" />);
    expect(container.querySelector('mark')).toBeNull();
    expect(container.textContent).toBe('before <em>after');
  });

  it('handles nested-looking markup by treating the outer <em> as the only emphasis', () => {
    const { container } = render(<Highlight value="<em>outer <em>inner</em> tail</em>" />);
    const marks = container.querySelectorAll('mark');
    // The parser does not support nesting; it pairs the first <em> with
    // the first </em>. Everything else stays as text.
    expect(marks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders empty string without throwing', () => {
    const { container } = render(<Highlight value="" />);
    expect(container.textContent).toBe('');
  });
});
