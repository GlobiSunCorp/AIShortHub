import { useEffect, useMemo, useState } from 'react';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { ErrorBoundary } from './ErrorBoundary';
import { Link, useRouter } from '../lib/router';
import { getStatusLabel } from '../lib/roleDisplay';
import { canAccessCreatorStudio, resolveMembership } from '../hooks/usePlanAccess';
import { MembershipBadge } from './EntitlementBadges';
import { CREATOR_HASH_ALIASES, CREATOR_STUDIO_GROUPS } from '../data/creatorStudio';

export function Header({ auth, platform }) {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [creatorMenuOpen, setCreatorMenuOpen] = useState(false);
  const [hash, setHash] = useState(typeof window === 'undefined' ? '' : window.location.hash || '');
  const membership = auth.user ? resolveMembership(auth, platform) : null;
  const showCreatorStudio = canAccessCreatorStudio(auth, platform);
  const isCreatorMode = auth.isLoggedIn && ['creator', 'admin'].includes(auth.userState);
  const isViewerMode = !isCreatorMode;
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

  useEffect(() => {
    setMenuOpen(false);
    setCreatorMenuOpen(false);
  }, [pathname, hash]);

  const viewerNav = [['/', 'Home'], ['/browse', 'Browse'], ['/pricing', 'Pricing'], ['/services', 'Services']];
  const creatorStudioGroups = useMemo(() => {
    const hasHigherPlan = membership?.creatorPlan === 'creator_pro' || membership?.creatorPlan === 'studio' || auth.userState === 'admin';
    return CREATOR_STUDIO_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.id === 'priority-support') return hasHigherPlan;
        return true;
      }),
    })).filter((group) => group.items.length > 0);
  }, [auth.userState, membership?.creatorPlan]);

  const safeAvatar = auth.user?.avatar || auth.user?.name?.slice(0, 2)?.toUpperCase() || 'U';
  const safeName = auth.user?.name || 'User';
  const safeEmail = auth.user?.email || 'Unknown email';
  const safeRole = auth.user?.role || auth.userState || 'member';

  return (
    <header className="site-header">
      <div className="container row split center">
        <Link to="/" className="brand brand-link" aria-label="Go to homepage" title="AIShortHub home">
          AIShortHub
        </Link>
        <nav className="row nav-wrap viewer-nav">
          {viewerNav.map(([to, label]) => {
            const active = pathname === to || (label === 'Browse' && isViewerMode);
            return (
              <Link key={to} to={to} className={active ? 'nav-link active' : 'nav-link'}>
                {label}
              </Link>
            );
          })}
        </nav>
        <nav className="row nav-wrap creator-nav">
          {showCreatorStudio ? (
            <div className="account-wrap">
              <button type="button" className={`nav-link creator-trigger ${pathname === '/creator' || isCreatorMode ? 'active' : ''}`} onClick={() => setCreatorMenuOpen((open) => !open)} aria-expanded={creatorMenuOpen} aria-haspopup="menu">
                Creator Studio ▾
              </button>
              {creatorMenuOpen ? (
                <div className="account-menu panel creator-menu">
                  {creatorStudioGroups.map((group) => (
                    <section key={group.id} className="creator-menu-group">
                      <p className="creator-menu-group-title">{group.title}</p>
                      <div className="creator-menu-items">
                        {group.items.map((item) => {
                          const targetHash = item.to.includes('#') ? item.to.slice(item.to.indexOf('#') + 1) : '';
                          const normalizedTargetHash = CREATOR_HASH_ALIASES[targetHash] || targetHash;
                          const currentHash = (hash || '').replace('#', '');
                          const normalizedCurrentHash = CREATOR_HASH_ALIASES[currentHash] || currentHash;
                          const active = item.to.startsWith('/creator')
                            ? pathname === '/creator' && (!normalizedTargetHash || normalizedCurrentHash === normalizedTargetHash)
                            : pathname === item.to;

                          return (
                            <Link key={`${item.to}-${item.label}`} to={item.to} className={`creator-menu-link ${active ? 'active' : ''}`.trim()} onClick={() => setCreatorMenuOpen(false)}>
                              <span className="creator-menu-link-head">
                                <span className="creator-menu-label">{item.label}</span>
                                <span className="creator-menu-side">
                                  {item.tag ? <span className="creator-menu-tag">{item.tag}</span> : null}
                                  <span className={`creator-menu-status ${active ? 'active' : ''}`} title={item.hint}>{item.status}</span>
                                </span>
                              </span>
                              <span className="creator-menu-link-meta" title={item.hint}>{item.hint}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
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
              <button className="avatar" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-haspopup="menu">
                {safeAvatar}
              </button>
              {menuOpen ? (
                <div className="account-menu panel">
                  <strong>{safeName}</strong>
                  <small>
                    {safeEmail} · {safeRole}
                  </small>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  {showCreatorStudio ? <Link to="/creator#overview" onClick={() => setMenuOpen(false)}>Creator Studio</Link> : null}
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
