import { useState } from 'react';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { Link, useRouter } from '../lib/router';
import { getStatusLabel } from '../lib/roleDisplay';

const nav = [
  ['/', 'Home'],
  ['/browse', 'Browse'],
  ['/creator', 'Creator'],
  ['/pricing', 'Pricing'],
  ['/services', 'Services'],
  ['/admin', 'Admin'],
];

export function Header({ auth, platform }) {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const membership = auth.user ? platform.memberships.find((item) => item.profileId === auth.user.id) : null;
  const statusLabel = getStatusLabel(auth.userState, membership?.tier, auth.user?.tier);

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
        </nav>
        <div className="row center header-actions">
          <span className="meta-pill">{statusLabel}</span>
          {auth.isLoggedIn ? (
            <div className="account-wrap">
              <button className="avatar" onClick={() => setMenuOpen((open) => !open)}>
                {auth.user.avatar}
              </button>
              {menuOpen ? (
                <div className="account-menu panel">
                  <strong>{auth.user.name}</strong>
                  <small>
                    {auth.user.email} · {auth.user.role}
                  </small>
                  <Link to="/profile">My Profile</Link>
                  <Link to="/creator">Creator dashboard</Link>
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
