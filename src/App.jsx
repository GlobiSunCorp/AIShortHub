import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { useAuthMock } from './hooks/useAuthMock';
import { RouterContext } from './lib/router';
import { AdminPage } from './pages/AdminPage';
import { BrowsePage } from './pages/BrowsePage';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { SeriesDetailPage } from './pages/SeriesDetailPage';
import { SignupPage } from './pages/SignupPage';
import { SubmitPage } from './pages/SubmitPage';
import { WatchPage } from './pages/WatchPage';

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
  if (pathname === '/login') return { name: 'login' };
  if (pathname === '/signup') return { name: 'signup' };
  if (pathname === '/forgot-password') return { name: 'forgot' };

  const seriesMatch = pathname.match(/^\/series\/([^/]+)$/);
  if (seriesMatch) return { name: 'series', id: seriesMatch[1] };

  const watchMatch = pathname.match(/^\/watch\/([^/]+)\/(\d+)$/);
  if (watchMatch) return { name: 'watch', id: watchMatch[1], episode: Number(watchMatch[2]) };

  return { name: 'home' };
}

export default function App() {
  const auth = useAuthMock();
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updatePath = () => setPathname(getPathname());
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const router = useMemo(
    () => ({
      pathname,
      navigate: (to, options = {}) => {
        if (typeof window === 'undefined') return;
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
      <AppLayout auth={auth}>
        {route.name === 'home' ? <HomePage auth={auth} /> : null}
        {route.name === 'browse' ? <BrowsePage /> : null}
        {route.name === 'series' ? <SeriesDetailPage id={route.id} /> : null}
        {route.name === 'watch' ? <WatchPage auth={auth} id={route.id} episode={route.episode} /> : null}
        {route.name === 'submit' ? <SubmitPage /> : null}
        {route.name === 'creator' ? <CreatorDashboardPage /> : null}
        {route.name === 'pricing' ? <PricingPage /> : null}
        {route.name === 'admin' ? <AdminPage /> : null}
        {route.name === 'login' ? <LoginPage auth={auth} /> : null}
        {route.name === 'signup' ? <SignupPage auth={auth} /> : null}
        {route.name === 'forgot' ? <ForgotPasswordPage auth={auth} /> : null}
      </AppLayout>
    </RouterContext.Provider>
  );
}
