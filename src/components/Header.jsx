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
        <div className="row">
          {auth.isLoggedIn ? (
            <>
              <button className="avatar">{auth.user.avatar}</button>
              <button className="btn btn-ghost" onClick={auth.logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a className="btn btn-ghost" href="/login">
                Login
              </a>
              <a className="btn btn-primary" href="/signup">
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
