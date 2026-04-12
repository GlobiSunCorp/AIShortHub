export function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal">
        <h3>Register to continue watching</h3>
        <p>Unlock watchlist, continue watching, and premium episodes after quick signup.</p>
        <div className="row">
          <a className="btn btn-primary" href="/signup" onClick={onClose}>
            Create account
          </a>
          <a className="btn btn-ghost" href="/login" onClick={onClose}>
            Log in
          </a>
        </div>
        <button className="text-link" onClick={onClose}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
