import { useEffect, useMemo, useState } from 'react';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { ErrorBoundary } from './ErrorBoundary';
import { Link, useRouter } from '../lib/router';
import { getStatusLabel } from '../lib/roleDisplay';
import { canAccessCreatorStudio, resolveMembership } from '../hooks/usePlanAccess';
import { MembershipBadge } from './EntitlementBadges';

export function Header({ auth, platform }) {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [creatorMenuOpen, setCreatorMenuOpen] = useState(false);
  const [hash, setHash] = useState(typeof window === 'undefined' ? '' : window.location.hash || '');
  const membership = auth.user ? resolveMembership(auth, platform) : null;
  const showCreatorStudio = canAccessCreatorStudio(auth, platform);
  const statusLabel = useMemo(() => {
    try {
      return getStatusLabel(auth.userState, membership?.tier, auth.user?.tier, membership?.creatorPlan);
    } catch (error) {
      console.error('Header status label fallback:', error);
      return auth.isLoggedIn ? 'Status: Member' : 'Status: Guest';
    }
  }, [auth.isLoggedIn, auth.user?.tier, auth.userState, membership?.creatorPlan, membership?.tier]);

  useEffect(() => {
    const update = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const viewerNav = [['/', 'Home'], ['/browse', 'Browse'], ['/pricing', 'Pricing'], ['/services', 'Services']];
  const creatorStudioItems = useMemo(() => {
    const base = [
      ['/creator#overview', 'Dashboard'],
      ['/creator#content', 'My Series'],
      ['/creator#assets', 'Upload Assets'],
      ['/creator#episodes', 'Episodes'],
      ['/creator#pricing', 'Pricing & Monetization'],
      ['/creator#earnings', 'Earnings'],
      ['/services', 'Service Orders'],
      ['/creator-guidelines', 'Creator Guidelines'],
    ];
    if (membership?.creatorPlan === 'creator_pro' || membership?.creatorPlan === 'studio' || auth.userState === 'admin') {
      return [...base, ['/creator#featured', 'Featured placement'], ['/creator#motion-poster', 'Motion Poster'], ['/creator#promo-tools', 'Promo tools'], ['/creator#priority-support', 'Priority support']];
    }
    return base;
  }, [auth.userState, membership?.creatorPlan]);

  const safeAvatar = auth.user?.avatar || auth.user?.name?.slice(0, 2)?.toUpperCase() || 'U';
  const safeName = auth.user?.name || 'User';
  const safeEmail = auth.user?.email || 'Unknown email';
  const safeRole = auth.user?.role || auth.userState || 'member';

  return (
    <header className="site-header">
      <div className="container row split center">
        <Link to="/" className="brand">
          AIShortHub
        </Link>
        <nav className="row nav-wrap viewer-nav">
          {viewerNav.map(([to, label]) => (
            <Link key={to} to={to} className={pathname === to ? 'nav-link active' : 'nav-link'}>
              {label}
            </Link>
          ))}
        </nav>
        <nav className="row nav-wrap creator-nav">
          {showCreatorStudio ? (
            <div className="account-wrap">
              <button type="button" className={`nav-link creator-trigger ${pathname === '/creator' ? 'active' : ''}`} onClick={() => setCreatorMenuOpen((open) => !open)}>
                Creator Studio ▾
              </button>
              {creatorMenuOpen ? (
                <div className="account-menu panel creator-menu">
                  {creatorStudioItems.map(([to, label]) => {
                    const targetHash = to.includes('#') ? to.slice(to.indexOf('#')) : '';
                    const active = pathname === '/creator' && (!targetHash || hash === targetHash);
                    return (
                      <Link key={to} to={to} className={active ? 'nav-link active' : 'nav-link'} onClick={() => setCreatorMenuOpen(false)}>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/pricing" className="nav-link locked-link">Upgrade for Creator Studio</Link>
          )}
          <Link to="/admin" className={pathname === '/admin' ? 'nav-link active' : 'nav-link'}>Admin</Link>
        </nav>
        <div className="row center header-actions">
          <span className="meta-pill">{statusLabel}</span>
          {auth.isLoggedIn && membership ? (
            <ErrorBoundary fallback={null}>
              <MembershipBadge auth={auth} membership={membership} />
            </ErrorBoundary>
          ) : null}
          {auth.isLoggedIn ? (
            <div className="account-wrap">
              <button className="avatar" onClick={() => setMenuOpen((open) => !open)}>
                {safeAvatar}
              </button>
              {menuOpen ? (
                <div className="account-menu panel">
                  <strong>{safeName}</strong>
                  <small>
                    {safeEmail} · {safeRole}
                  </small>
                  <Link to="/profile">My Profile</Link>
                  {showCreatorStudio ? <Link to="/creator">Creator Studio</Link> : null}
                  <DemoRoleSwitcher auth={auth} compact />
                  <button className="btn btn-ghost" onClick={auth.logout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
