import { Link } from '../lib/router';

export function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal">
        <h3>Register to continue watching</h3>
        <p>Unlock watchlist, continue watching, and premium episodes after quick signup.</p>
        <div className="row">
          <Link className="btn btn-primary" to="/signup" onClick={onClose}>
            Create account
          </Link>
          <Link className="btn btn-ghost" to="/login" onClick={onClose}>
            Log in
          </Link>
        </div>
        <button className="text-link" onClick={onClose}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
