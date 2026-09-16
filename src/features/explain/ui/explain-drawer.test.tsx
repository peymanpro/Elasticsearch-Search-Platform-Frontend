import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/helpers/render-with-providers';
import { server } from '@/test/msw/server';

import { ExplainDrawer } from './explain-drawer';

describe('ExplainDrawer', () => {
  it('is idle when documentId is null', () => {
    renderWithProviders(<ExplainDrawer open onClose={() => {}} query="x" documentId={null} />);
    // No request should be made, so the spinner or content should not appear.
    expect(screen.queryByText('Loading explanation')).not.toBeInTheDocument();
  });

  it('shows the document id and query in the header', () => {
    renderWithProviders(
      <ExplainDrawer open onClose={() => {}} query="wireless" documentId="SKU-1" />,
    );
    expect(screen.getByText('SKU-1')).toBeInTheDocument();
    expect(screen.getByText('wireless')).toBeInTheDocument();
  });

  it('renders the explanation tree when matched', async () => {
    server.use(
      http.post('*/api/explain/', () =>
        HttpResponse.json({
          matched: true,
          explanation: {
            value: 5,
            description: 'sum of:',
            details: [{ value: 3, description: 'weight(name)', details: [] }],
          },
        }),
      ),
    );

    renderWithProviders(
      <ExplainDrawer open onClose={() => {}} query="wireless" documentId="SKU-1" />,
    );

    await waitFor(() => {
      expect(screen.getByText('sum of:')).toBeInTheDocument();
    });
    expect(screen.getByText('weight(name)')).toBeInTheDocument();
  });

  it('shows "No match" when the document does not match', async () => {
    server.use(
      http.post('*/api/explain/', () => HttpResponse.json({ matched: false, explanation: null })),
    );

    renderWithProviders(<ExplainDrawer open onClose={() => {}} query="q" documentId="SKU-9" />);

    await waitFor(() => {
      expect(screen.getByText('No match')).toBeInTheDocument();
    });
  });

  it('shows an error state when the request fails', async () => {
    server.use(
      http.post('*/api/explain/', () =>
        HttpResponse.json(
          { error: { code: 'backend_unavailable', message: 'down' } },
          { status: 503 },
        ),
      ),
    );

    renderWithProviders(<ExplainDrawer open onClose={() => {}} query="q" documentId="SKU-9" />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    renderWithProviders(<ExplainDrawer open onClose={onClose} query="q" documentId="SKU-9" />);
    const close = screen.getByRole('button', { name: 'Close' });
    close.click();
    expect(onClose).toHaveBeenCalled();
  });
});
