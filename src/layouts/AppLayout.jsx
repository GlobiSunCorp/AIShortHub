import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FloatingCreatorToolbox } from '../components/FloatingCreatorToolbox';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { StickyUpgradeRail } from '../components/StickyUpgradeRail';
import { useRouter } from '../lib/router';

const PAGE_TITLES = {
  '/': 'Home',
  '/browse': 'Browse',
  '/creator': 'Creator Studio',
  '/pricing': 'Pricing',
  '/services': 'Services',
  '/admin': 'Admin',
  '/profile': 'Profile',
  '/login': 'Login',
  '/signup': 'Signup',
};

const PAGE_SUBTITLES = {
  '/': 'Discover launch titles, preview flows, and creator-friendly monetization.',
  '/browse': 'Search, sort, and filter the catalog with clearer viewer controls.',
  '/creator': 'Manage uploads, pricing, earnings, review, and launch readiness.',
  '/pricing': 'Compare viewer access and creator plans with clearer fee logic.',
  '/services': 'Submit and track service orders with next-step guidance.',
  '/admin': 'Review content, moderation queues, and platform operations.',
  '/profile': 'Check plans, billing, payouts, and account preferences.',
};

export function AppLayout({ auth, platform, children }) {
  const { pathname } = useRouter();
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    setRouting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setRouting(false), 180);
    return () => clearTimeout(timer);
  }, [pathname]);

  const title = useMemo(() => PAGE_TITLES[pathname] || 'Workspace', [pathname]);
  const subtitle = useMemo(() => PAGE_SUBTITLES[pathname] || 'Use the workspace below to continue your next task.', [pathname]);

  return (
    <div className="app-shell">
      <ErrorBoundary>
        <Header auth={auth} platform={platform} />
      </ErrorBoundary>
      <div className={`container page-context-bar ${routing ? 'is-routing' : ''}`}>
        <p className="kicker">Current Page</p>
        <div className="page-context-copy">
          <strong>{title}</strong>
          <p className="ds-meta">{subtitle}</p>
        </div>
      </div>
      <main className="container page-shell">{children}</main>
      <ErrorBoundary>
        <FloatingCreatorToolbox auth={auth} platform={platform} />
      </ErrorBoundary>
      <ErrorBoundary>
        <StickyUpgradeRail auth={auth} platform={platform} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
