import { useState } from 'react';
import { Link, useRouter } from '../lib/router';

const nav = [
  ['/', 'Home'],
  ['/browse', 'Browse'],
  ['/submit', 'Submit'],
  ['/creator', 'Creator Dashboard'],
  ['/pricing', 'Pricing'],
  ['/admin', 'Admin'],
];

export function Header({ auth }) {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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
          {auth.isLoggedIn ? (
            <div className="account-wrap">
              <button className="avatar" onClick={() => setMenuOpen((open) => !open)}>
                {auth.user.avatar}
              </button>
              {menuOpen ? (
                <div className="account-menu panel">
                  <strong>{auth.user.name}</strong>
                  <small>{auth.user.email}</small>
                  <Link to="/creator">Creator workspace</Link>
                  <Link to="/pricing">Manage plan</Link>
                  <button className="btn btn-ghost" onClick={auth.logout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <span className="status">Guest mode</span>
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
