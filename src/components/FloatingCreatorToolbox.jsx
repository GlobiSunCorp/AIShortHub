import { useMemo, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { canAccessCreatorStudio, isHighTierCreator } from '../hooks/usePlanAccess';

export function FloatingCreatorToolbox({ auth, platform }) {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const enabled = canAccessCreatorStudio(auth, platform);
  const highTier = isHighTierCreator(auth, platform);
  const isStudioSurface = ['/creator', '/services', '/profile', '/browse'].some((prefix) => pathname.startsWith(prefix));

  const entries = useMemo(
    () => [
      ['Overview workspace', '/creator'],
      ['Content & episodes', '/creator'],
      ['Assets upload', '/creator'],
      ['Pricing setup', '/creator'],
      ['Review & publish', '/creator'],
      ['Service orders', '/services'],
      ['Account center', '/profile'],
      ['Plans & entitlements', '/pricing'],
      ['Support', '/services'],
      ...(highTier
        ? [
            ['Motion Poster', '/services'],
            ['TikTok Promo Pack', '/services'],
            ['Featured request', '/creator'],
            ['Earnings & payout', '/profile'],
            ['Priority support', '/services'],
          ]
        : []),
    ],
    [highTier]
  );

  if (!enabled || !isStudioSurface) return null;

  return (
    <aside className={`creator-toolbox ${open ? 'open' : ''}`}>
      <button type="button" className="btn btn-primary toolbox-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? '收起 Toolbox' : 'Creator Toolbox'}
      </button>
      {open ? (
        <div className="panel toolbox-menu">
          {entries.map(([label, to]) => (
            <Link key={`${label}-${to}`} to={to} className={pathname === to ? 'toolbox-link active' : 'toolbox-link'}>
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
