import { Link } from '../lib/router';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container stack-sm">
        <p>AIShortHub pilot · Real auth/data/storage/payment structure with mock fallback.</p>
        <div className="row wrap small-text">
          <Link to="/faq">FAQ</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/refund">Refund</Link>
          <Link to="/support">Support</Link>
          <Link to="/creator-guidelines">Creator Guidelines</Link>
          <Link to="/content-policy">Content Policy</Link>
          <Link to="/commission-payout">Commission & Payout</Link>
        </div>
      </div>
    </footer>
  );
}
