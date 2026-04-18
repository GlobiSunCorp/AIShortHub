import { useState } from 'react';
import { Link } from '../lib/router';
import { GLOSSARY } from '../data/glossary';

const learnMoreRoutes = {
  platform_commission: '/pricing',
  subscription_pool_share: '/pricing',
  ad_revenue_share: '/pricing',
  pending_payout: '/profile',
  active_series: '/creator',
  quota_reset: '/profile',
  title_pricing: '/creator',
  episode_unlock_price: '/series/s1',
  featured_placement: '/creator',
  addon_services: '/services',
};

export function GlossaryTerm({ id, compact = false, tier = 'quick' }) {
  const [open, setOpen] = useState(false);
  const item = GLOSSARY[id];
  if (!item) return null;
  const link = learnMoreRoutes[id];

  return (
    <span
      className={`glossary-term ${compact ? 'compact' : ''}`.trim()}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button" className="glossary-trigger" onClick={() => setOpen((prev) => !prev)} aria-label={`Explain ${item.term}`}>
        ⓘ
      </button>
      {open ? (
        <span className="glossary-popover" role="tooltip">
          <strong>{item.term}</strong>
          <span>{item.short}</span>
          {tier === 'learn_more' ? <span className="small-text">{item.detail}</span> : null}
          {tier === 'learn_more' && link ? (
            <Link className="learn-more-link" to={link}>Learn more</Link>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

export function GlossaryInline({ id, label, tier = 'quick' }) {
  return <>{label} <GlossaryTerm id={id} compact tier={tier} /></>;
}
