import { SUPPORT_CONTACT_CONFIG } from '../data/monetization';
import { Link } from '../lib/router';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container stack-sm">
        <p>AIShortHub pilot · Real auth/data/storage/payment structure with mock fallback.</p>
        <p>Support: {SUPPORT_CONTACT_CONFIG.supportEmail} · Creator Ops: {SUPPORT_CONTACT_CONFIG.creatorOpsEmail} · Policy: {SUPPORT_CONTACT_CONFIG.policyEmail}</p>
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
