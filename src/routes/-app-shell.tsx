import { Link, Outlet } from '@tanstack/react-router';

import { HealthBadge } from '@/features/health/ui/health-badge';
import { ThemeToggle } from '@/shared/ui/theme-toggle';

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link
          to="/search"
          className="text-base font-semibold tracking-tight text-[var(--color-fg)]"
        >
          Search Lens
        </Link>
        <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
          <NavLink to="/search" label="Search" />
          <NavLink to="/health" label="Health" />
          <NavLink to="/about" label="About" />
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <HealthBadge />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  to: '/search' | '/health' | '/about';
  label: string;
}

function NavLink({ to, label }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-fg)]"
      activeProps={{
        className:
          'rounded-[var(--radius-sm)] px-2.5 py-1.5 bg-[var(--color-accent-muted)] text-[var(--color-fg)]',
      }}
    >
      {label}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-fg-subtle)]">
      Search Lens — a read-only frontend for the Elasticsearch Search Platform.
    </footer>
  );
}
