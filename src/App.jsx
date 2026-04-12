import { AppLayout } from './layouts/AppLayout';
import { useAuthMock } from './hooks/useAuthMock';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { BrowsePage } from './pages/BrowsePage';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { SeriesDetailPage } from './pages/SeriesDetailPage';
import { SubmitPage } from './pages/SubmitPage';
import { WatchPage } from './pages/WatchPage';

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
  const route = resolveRoute(window.location.pathname);

  return (
    <AppLayout auth={auth}>
      {route.name === 'home' ? <HomePage auth={auth} /> : null}
      {route.name === 'browse' ? <BrowsePage /> : null}
      {route.name === 'series' ? <SeriesDetailPage id={route.id} /> : null}
      {route.name === 'watch' ? <WatchPage auth={auth} id={route.id} episode={route.episode} /> : null}
      {route.name === 'submit' ? <SubmitPage /> : null}
      {route.name === 'creator' ? <CreatorDashboardPage /> : null}
      {route.name === 'pricing' ? <PricingPage /> : null}
      {route.name === 'admin' ? <AdminPage /> : null}
      {route.name === 'login' ? <AuthPage mode="login" auth={auth} /> : null}
      {route.name === 'signup' ? <AuthPage mode="signup" auth={auth} /> : null}
      {route.name === 'forgot' ? <AuthPage mode="forgot" auth={auth} /> : null}
    </AppLayout>
  );
}
