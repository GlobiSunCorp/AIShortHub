import { SUPPORT_CONTACT_CONFIG } from '../data/monetization';
import { Link } from '../lib/router';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container stack-sm">
        <p><strong>AIShortHub</strong> is operated by GlobiSun Multimedia Corp.</p>
        <p>Contact: <a href="mailto:contact@globisunmultimedia.com">contact@globisunmultimedia.com</a> · Support: {SUPPORT_CONTACT_CONFIG.supportEmail}</p>
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
        <p>© 2026 GlobiSun Multimedia Corp. All rights reserved.</p>
      </div>
    </footer>
  );
}
