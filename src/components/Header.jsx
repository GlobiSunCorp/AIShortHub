import { useMemo, useState } from 'react';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { ErrorBoundary } from './ErrorBoundary';
import { Link, useRouter } from '../lib/router';
import { getStatusLabel } from '../lib/roleDisplay';
import { canAccessCreatorStudio, resolveMembership } from '../hooks/usePlanAccess';
import { MembershipBadge } from './EntitlementBadges';

export function Header({ auth, platform }) {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const nav = useMemo(
    () => [
      ['/', 'Home'],
      ['/browse', 'Browse'],
      ...(showCreatorStudio ? [['/creator', 'Creator Studio']] : []),
      ['/pricing', 'Pricing'],
      ['/services', 'Services'],
      ['/admin', 'Admin'],
    ],
    [showCreatorStudio]
  );

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
        <nav className="row nav-wrap">
          {nav.map(([to, label]) => (
            <Link key={to} to={to} className={pathname === to ? 'nav-link active' : 'nav-link'}>
              {label}
            </Link>
          ))}
          {!showCreatorStudio ? <Link to="/pricing" className="nav-link">Upgrade for Creator Studio</Link> : null}
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
