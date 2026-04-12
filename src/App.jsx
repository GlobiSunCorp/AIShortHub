import { useEffect, useMemo, useState } from 'react';
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

function getPathname() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

function resolveRoute(pathname) {
  if (pathname === '/') return { name: 'home' };
  if (pathname === '/browse') return { name: 'browse' };
  if (pathname === '/submit') return { name: 'submit' };
  if (pathname === '/creator') return { name: 'creator' };
  if (pathname === '/pricing') return { name: 'pricing' };
  if (pathname === '/admin') return { name: 'admin' };
  if (pathname === '/services') return { name: 'services' };
  if (pathname === '/profile') return { name: 'profile' };
  if (pathname === '/login') return { name: 'login' };
  if (pathname === '/signup') return { name: 'signup' };
  if (pathname === '/forgot-password') return { name: 'forgot' };
  if (pathname === '/faq') return { name: 'faq' };
  if (pathname === '/support') return { name: 'support' };
  if (pathname === '/checkout/success') return { name: 'checkoutSuccess' };
  if (pathname === '/checkout/cancel') return { name: 'checkoutCancel' };
  if (pathname === '/terms') return { name: 'terms' };
  if (pathname === '/privacy') return { name: 'privacy' };
  if (pathname === '/refund') return { name: 'refund' };
  if (pathname === '/creator-guidelines') return { name: 'creatorGuidelines' };
  if (pathname === '/content-policy') return { name: 'contentPolicy' };
  if (pathname === '/commission-payout') return { name: 'commissionPayout' };

  const serviceOrderMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceOrderMatch) return { name: 'serviceOrderDetail', id: serviceOrderMatch[1] };

  const seriesMatch = pathname.match(/^\/series\/([^/]+)$/);
  if (seriesMatch) return { name: 'series', id: seriesMatch[1] };

  const watchMatch = pathname.match(/^\/watch\/([^/]+)\/(\d+)$/);
  if (watchMatch) return { name: 'watch', id: watchMatch[1], episode: Number(watchMatch[2]) };

  return { name: 'home' };
}

export default function App() {
  const auth = useAuth();
  const platform = usePlatformState(auth);
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const updatePath = () => setPathname(getPathname());
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const router = useMemo(
    () => ({
      pathname,
      navigate: (to, options = {}) => {
        const method = options.replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', to);
        setPathname(to);
      },
    }),
    [pathname]
  );

  const route = resolveRoute(pathname);

  return (
    <RouterContext.Provider value={router}>
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
          {route.name === 'checkoutSuccess' ? <CheckoutResultPage type="success" /> : null}
          {route.name === 'checkoutCancel' ? <CheckoutResultPage type="cancel" /> : null}
          {route.name === 'terms' ? <PolicyPage type="terms" /> : null}
          {route.name === 'privacy' ? <PolicyPage type="privacy" /> : null}
          {route.name === 'refund' ? <PolicyPage type="refund" /> : null}
          {route.name === 'creatorGuidelines' ? <PolicyPage type="creatorGuidelines" /> : null}
          {route.name === 'contentPolicy' ? <PolicyPage type="contentPolicy" /> : null}
          {route.name === 'commissionPayout' ? <PolicyPage type="commissionPayout" /> : null}
        </ErrorBoundary>
      </AppLayout>
    </RouterContext.Provider>
  );
}
