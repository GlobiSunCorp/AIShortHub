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
};

export function AppLayout({ auth, platform, children }) {
  const { pathname } = useRouter();
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    setRouting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setRouting(false), 260);
    return () => clearTimeout(timer);
  }, [pathname]);

  const title = useMemo(() => PAGE_TITLES[pathname] || 'Workspace', [pathname]);

  return (
    <div className="app-shell">
      <ErrorBoundary>
        <Header auth={auth} platform={platform} />
      </ErrorBoundary>
      <div className="container page-context-bar row split wrap">
        <div>
          <p className="kicker">Current Page</p>
          <strong>{title}</strong>
        </div>
        <span className={`status ${routing ? '' : 'ok'}`}>{routing ? 'Switching...' : 'Ready'}</span>
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
