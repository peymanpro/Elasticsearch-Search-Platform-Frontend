import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import { useSuggest } from '@/features/autocomplete/api/use-suggest';
import { FilterChips } from '@/features/filters/ui/filter-chips';
import { FilterPanel } from '@/features/filters/ui/filter-panel';
import { useSearch } from '@/features/search/api/use-search';
import { PaginationControls } from '@/features/search/ui/pagination-controls';
import { ResultList } from '@/features/search/ui/result-list';
import { SearchBar } from '@/features/search/ui/search-bar';
import { SortSelector } from '@/features/search/ui/sort-selector';
import { DEFAULT_PAGE_SIZE } from '@/shared/config/search-constants';
import {
  applySearchParamsPatch,
  parseSearchParams,
  searchParamsToRecord,
  type SearchParams,
  type SearchParamsPatch,
} from '@/shared/lib/search-params';
import { Button } from '@/shared/ui/button';
import { Drawer } from '@/shared/ui/drawer';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';

import { Route as SearchRoute } from './search';

export const Route = createLazyFileRoute('/search')({
  component: SearchPage,
});

function SearchPage() {
  const urlSearch = SearchRoute.useSearch();
  const navigate = useNavigate();
  const params = useMemo(() => parseSearchParams(urlSearch), [urlSearch]);

  const [draft, setDraft] = useState<string>(params?.q ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const searchQuery = useSearch(params);
  const suggestQuery = useSuggest(draft);

  const handleSubmitQuery = useCallback(
    (q: string) => {
      navigate({ to: '/search', search: { q } });
    },
    [navigate],
  );

  const updateParams = useCallback(
    (patch: SearchParamsPatch) => {
      if (params === null) return;
      const next = applySearchParamsPatch(params, patch);
      navigate({ to: '/search', search: searchParamsToRecord(next) });
    },
    [navigate, params],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (params === null) return;
      const next: SearchParams = { ...params, page };
      navigate({ to: '/search', search: searchParamsToRecord(next) });
    },
    [navigate, params],
  );

  const handleClearAll = useCallback(() => {
    if (params === null) return;
    navigate({ to: '/search', search: { q: params.q } });
  }, [navigate, params]);

  // No query in the URL: render the landing search bar only.
  if (params === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-4 text-2xl font-semibold">Search Lens</h1>
        <SearchBar
          query=""
          suggestions={suggestQuery.data?.suggestions ?? []}
          suggestionsLoading={suggestQuery.isFetching}
          onSubmit={handleSubmitQuery}
          onSelectSuggestion={handleSubmitQuery}
          onDraftChange={setDraft}
          autoFocus
        />
        <EmptyState
          title="Start with a query"
          description="Type what you are looking for. You can filter and sort once results are in."
        />
      </div>
    );
  }

  const facets = searchQuery.data?.facets;
  const categories = facets?.categories ?? [];
  const brands = facets?.brands ?? [];
  const availability = facets?.availability ?? [];

  const filterPanel = (
    <FilterPanel
      value={params}
      categories={categories}
      brands={brands}
      availability={availability}
      onChange={updateParams}
      onClearAll={handleClearAll}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SearchBar
        query={params.q}
        suggestions={suggestQuery.data?.suggestions ?? []}
        suggestionsLoading={suggestQuery.isFetching}
        onSubmit={handleSubmitQuery}
        onSelectSuggestion={handleSubmitQuery}
        onDraftChange={setDraft}
        autoFocus
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">{filterPanel}</div>
        </aside>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>
            <div className="ml-auto w-full sm:w-56">
              <SortSelector value={params.sort} onChange={(v) => updateParams({ sort: v })} />
            </div>
          </div>

          <FilterChips value={params} onChange={updateParams} />

          <SearchResults query={searchQuery} onExplain={setSelectedDocumentId} />

          {searchQuery.data ? (
            <PaginationControls
              page={params.page}
              pageSize={DEFAULT_PAGE_SIZE}
              total={searchQuery.data.total}
              returned={searchQuery.data.returned}
              hasMore={searchQuery.data.has_more}
              onPageChange={handlePageChange}
            />
          ) : null}

          {selectedDocumentId ? (
            <p className="text-xs text-[var(--color-fg-subtle)]">
              Explain for {selectedDocumentId} will open in the drawer (Phase 9).
            </p>
          ) : null}
        </section>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="left" title="Filters">
        {filterPanel}
      </Drawer>
    </div>
  );
}

interface SearchResultsProps {
  query: ReturnType<typeof useSearch>;
  onExplain: (documentId: string) => void;
}

function SearchResults({ query, onExplain }: SearchResultsProps) {
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }
  if (query.isPending) {
    return <ResultList hits={[]} loading onExplain={onExplain} />;
  }
  const hits = query.data.hits;
  if (hits.length === 0) {
    return (
      <EmptyState title="No results" description="Try a different query, or clear some filters." />
    );
  }
  return <ResultList hits={hits} loading={query.isFetching} onExplain={onExplain} />;
}
