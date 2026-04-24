import { useEffect, useMemo, useState } from 'react';
import './styles/interaction.css';
import { AppLayout } from './layouts/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { usePlatformState } from './hooks/usePlatformState';
import { RouterContext } from './lib/router';
import { AdminPage } from './pages/AdminPage';
import { BrowsePage } from './pages/BrowsePage';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SeriesDetailPage } from './pages/SeriesDetailPage';
import { ServiceOrderDetailPage } from './pages/ServiceOrderDetailPage';
import { ServiceOrdersPage } from './pages/ServiceOrdersPage';
import { SignupPage } from './pages/SignupPage';
import { SubmitPage } from './pages/SubmitPage';
import { WatchPage } from './pages/WatchPage';
import { PolicyPage } from './pages/PolicyPage';
import { FAQPage } from './pages/FAQPage';
import { ContactSupportPage } from './pages/ContactSupportPage';
import { CheckoutResultPage } from './pages/CheckoutResultPage';

function getCurrentUrl() {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname || '/'}${window.location.search || ''}${window.location.hash || ''}`;
}

function normalizePathname(pathname) {
  return (pathname || '/').split('#')[0].split('?')[0] || '/';
}

function resolveRoute(pathname) {
  const normalized = normalizePathname(pathname);
  if (normalized === '/') return { name: 'home' };
  if (normalized === '/browse') return { name: 'browse' };
  if (normalized === '/submit') return { name: 'submit' };
  if (normalized === '/creator' || normalized === '/creator-studio') return { name: 'creator' };
  if (normalized === '/pricing') return { name: 'pricing' };
  if (normalized === '/admin') return { name: 'admin' };
  if (normalized === '/services' || normalized === '/services/orders') return { name: 'services' };
  if (normalized === '/profile') return { name: 'profile' };
  if (normalized === '/login') return { name: 'login' };
  if (normalized === '/signup') return { name: 'signup' };
  if (normalized === '/forgot-password') return { name: 'forgot' };
  if (normalized === '/faq') return { name: 'faq' };
  if (normalized === '/support') return { name: 'support' };
  if (normalized === '/checkout/success') return { name: 'checkoutSuccess' };
  if (normalized === '/checkout/cancel') return { name: 'checkoutCancel' };
  if (normalized === '/terms') return { name: 'terms' };
  if (normalized === '/privacy') return { name: 'privacy' };
  if (normalized === '/refund') return { name: 'refund' };
  if (normalized === '/creator-guidelines') return { name: 'creatorGuidelines' };
  if (normalized === '/content-policy') return { name: 'contentPolicy' };
  if (normalized === '/commission-payout') return { name: 'commissionPayout' };

  const serviceOrderMatch = normalized.match(/^\/services\/([^/]+)$/);
  if (serviceOrderMatch) return { name: 'serviceOrderDetail', id: serviceOrderMatch[1] };

  const seriesMatch = normalized.match(/^\/series\/([^/]+)$/);
  if (seriesMatch) return { name: 'series', id: seriesMatch[1] };

  const watchMatch = normalized.match(/^\/watch\/([^/]+)\/(\d+)$/);
  if (watchMatch) return { name: 'watch', id: watchMatch[1], episode: Number(watchMatch[2]) };

  return { name: 'home' };
}

export default function App() {
  const auth = useAuth();
  const platform = usePlatformState(auth);
  const [fullPath, setFullPath] = useState(getCurrentUrl);

  useEffect(() => {
    const updatePath = () => setFullPath(getCurrentUrl());
    window.addEventListener('popstate', updatePath);
    window.addEventListener('hashchange', updatePath);
    window.addEventListener('app:navigation', updatePath);
    return () => {
      window.removeEventListener('popstate', updatePath);
      window.removeEventListener('hashchange', updatePath);
      window.removeEventListener('app:navigation', updatePath);
    };
  }, []);

  const router = useMemo(
    () => ({
      pathname: normalizePathname(fullPath),
      fullPath,
      navigate: (to, options = {}) => {
        const method = options.replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', to);
        setFullPath(getCurrentUrl());
        window.dispatchEvent(new Event('app:navigation'));
      },
    }),
    [fullPath]
  );

  const route = resolveRoute(fullPath);

  return (
    <RouterContext.Provider value={router}>
      <ErrorBoundary>
        <AppLayout auth={auth} platform={platform}>
          <ErrorBoundary>
            {route.name === 'home' ? <HomePage auth={auth} platform={platform} /> : null}
            {route.name === 'browse' ? <BrowsePage platform={platform} /> : null}
            {route.name === 'series' ? <SeriesDetailPage id={route.id} platform={platform} auth={auth} /> : null}
            {route.name === 'watch' ? <WatchPage auth={auth} id={route.id} episode={route.episode} platform={platform} /> : null}
            {route.name === 'submit' ? <SubmitPage /> : null}
            {route.name === 'creator' ? <CreatorDashboardPage auth={auth} platform={platform} /> : null}
            {route.name === 'pricing' ? <PricingPage auth={auth} platform={platform} /> : null}
            {route.name === 'services' ? <ServiceOrdersPage auth={auth} platform={platform} /> : null}
            {route.name === 'serviceOrderDetail' ? <ServiceOrderDetailPage id={route.id} platform={platform} auth={auth} /> : null}
            {route.name === 'profile' ? <ProfilePage auth={auth} platform={platform} /> : null}
            {route.name === 'admin' ? <AdminPage platform={platform} auth={auth} /> : null}
            {route.name === 'login' ? <LoginPage auth={auth} /> : null}
            {route.name === 'signup' ? <SignupPage auth={auth} /> : null}
            {route.name === 'forgot' ? <ForgotPasswordPage auth={auth} /> : null}
            {route.name === 'faq' ? <FAQPage /> : null}
            {route.name === 'support' ? <ContactSupportPage /> : null}
            {route.name === 'checkoutSuccess' ? <CheckoutResultPage type="success" auth={auth} platform={platform} /> : null}
            {route.name === 'checkoutCancel' ? <CheckoutResultPage type="cancel" auth={auth} platform={platform} /> : null}
            {route.name === 'terms' ? <PolicyPage type="terms" /> : null}
            {route.name === 'privacy' ? <PolicyPage type="privacy" /> : null}
            {route.name === 'refund' ? <PolicyPage type="refund" /> : null}
            {route.name === 'creatorGuidelines' ? <PolicyPage type="creatorGuidelines" /> : null}
            {route.name === 'contentPolicy' ? <PolicyPage type="contentPolicy" /> : null}
            {route.name === 'commissionPayout' ? <PolicyPage type="commissionPayout" /> : null}
          </ErrorBoundary>
        </AppLayout>
      </ErrorBoundary>
    </RouterContext.Provider>
  );
}
