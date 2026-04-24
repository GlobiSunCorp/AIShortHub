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

const GLOBAL_FLASH_KEY = 'aishorthub.globalFlash';

function GlobalFlash({ flash, onClose }) {
  if (!flash?.message) return null;
  const isError = flash.type === 'error';
  return (
    <div className="container" style={{ marginTop: '0.75rem' }}>
      <div
        className="panel row wrap center"
        style={{
          justifyContent: 'space-between',
          gap: '0.8rem',
          borderColor: isError ? 'rgba(255, 142, 162, 0.42)' : 'rgba(139, 225, 172, 0.32)',
          background: isError
            ? 'linear-gradient(135deg, rgba(68, 24, 38, 0.92), rgba(16, 13, 24, 0.96))'
            : 'linear-gradient(135deg, rgba(23, 56, 45, 0.92), rgba(13, 16, 29, 0.96))',
          boxShadow: isError ? '0 14px 34px rgba(64, 12, 28, 0.22)' : '0 14px 34px rgba(16, 44, 34, 0.16)',
        }}
      >
        <div style={{ display: 'grid', gap: '0.2rem' }}>
          <strong>{flash.title || (isError ? 'Update needed' : 'Updated ✨')}</strong>
          <span className="small-text" style={{ color: '#eef3ff' }}>{flash.message}</span>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onClose}>关闭</button>
      </div>
    </div>
  );
}

export function AppLayout({ auth, platform, children }) {
  const { pathname } = useRouter();
  const [routing, setRouting] = useState(false);
  const [hash, setHash] = useState(typeof window === 'undefined' ? '' : window.location.hash || '');
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    setRouting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setRouting(false), 180);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(GLOBAL_FLASH_KEY);
      if (!raw) return;
      const next = JSON.parse(raw);
      if (next?.message) setFlash(next);
      window.sessionStorage.removeItem(GLOBAL_FLASH_KEY);
    } catch {
      // ignore invalid flash payloads
    }
  }, [pathname]);

  useEffect(() => {
    if (!flash?.message) return undefined;
    const timer = window.setTimeout(() => setFlash(null), 4200);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const title = useMemo(() => PAGE_TITLES[pathname] || 'Workspace', [pathname]);
  const subtitle = useMemo(() => {
    if (pathname !== '/creator') return PAGE_SUBTITLES[pathname] || 'Use the workspace below to continue your next task.';
    const map = {
      '#overview': 'Creator Studio / Dashboard · Overview of health, actions, and active quota.',
      '#content': 'Creator Studio / My Series · Edit draft metadata, episode structure, and release plan.',
      '#assets': 'Creator Studio / Upload Assets · Manage trailer, poster, subtitle, and promo deliverables.',
      '#pricing': 'Creator Studio / Pricing & Monetization · Configure unlock pricing and platform revenue rules.',
      '#earnings': 'Creator Studio / Earnings · Review payout, deductions, and period-over-period change.',
      '#review': 'Creator Studio / Review & Publish · Final QA checks and submit to moderation queue.',
      '#featured': 'Creator Studio / Featured Placement (Module) · Add-on quota and launch slot request.',
      '#motion-poster': 'Creator Studio / Motion Poster (Module) · Pro rendering queue and asset status.',
      '#promo-tools': 'Creator Studio / Promo Tools (Module) · Beta hooks, captions, and channel packs.',
      '#priority-support': 'Creator Studio / Priority Support (Module) · Studio-only operational escalation.',
    };
    return map[hash] || PAGE_SUBTITLES[pathname] || 'Use the workspace below to continue your next task.';
  }, [hash, pathname]);

  return (
    <div className="app-shell">
      <ErrorBoundary>
        <Header auth={auth} platform={platform} />
      </ErrorBoundary>
      <GlobalFlash flash={flash} onClose={() => setFlash(null)} />
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
