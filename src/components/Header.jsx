import { useState } from 'react';

const nav = [
  ['/', 'Home'],
  ['/browse', 'Browse'],
  ['/submit', 'Submit'],
  ['/creator', 'Creator Dashboard'],
  ['/pricing', 'Pricing'],
  ['/admin', 'Admin'],
];

export function Header({ auth }) {
  const current = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container row split center">
        <a href="/" className="brand">
          AIShortHub
        </a>
        <nav className="row nav-wrap">
          {nav.map(([to, label]) => (
            <a key={to} href={to} className={current === to ? 'nav-link active' : 'nav-link'}>
              {label}
            </a>
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
                  <a href="/creator">Creator workspace</a>
                  <a href="/pricing">Manage plan</a>
                  <button className="btn btn-ghost" onClick={auth.logout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <span className="status">Guest mode</span>
              <a className="btn btn-ghost" href="/login">
                Login
              </a>
              <a className="btn btn-primary" href="/signup">
                Start free
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
