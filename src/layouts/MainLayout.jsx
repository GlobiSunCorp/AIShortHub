import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  ["Home", "/"],
  ["Browse", "/browse"],
  ["Submit", "/submit"],
  ["Creator Dashboard", "/creator"],
  ["Pricing", "/pricing"],
];

const navClass = ({ isActive }) => (isActive ? "nav-btn active" : "nav-btn");

export default function MainLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand-btn">
            AIShortHub
          </NavLink>

          <nav className="top-nav">
            {navItems.map(([label, to]) => (
              <NavLink key={to} to={to} className={navClass} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button className="btn btn-outline">Login</button>
            <NavLink to="/submit" className="btn btn-light">
              Upload Your Series
            </NavLink>
          </div>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">AIShortHub</div>
            <p>Curated AI short dramas for viewers and creators.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <div className="footer-list">
              <div>Browse</div>
              <div>Submit</div>
              <div>Creator Services</div>
            </div>
          </div>
          <div>
            <h4>Legal</h4>
            <div className="footer-list">
              <div>Terms of Use</div>
              <div>Privacy Policy</div>
              <div>Copyright Policy</div>
            </div>
          </div>
          <div>
            <h4>Internal Demo</h4>
            <div className="button-row wrap">
              <NavLink to="/creator" className="btn btn-outline small">
                Creator
              </NavLink>
              <NavLink to="/admin" className="btn btn-outline small">
                Admin
              </NavLink>
              <NavLink to="/pricing" className="btn btn-outline small">
                Pricing
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
