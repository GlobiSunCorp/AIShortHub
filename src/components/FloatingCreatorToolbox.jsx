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
      ['新建剧集', '/creator'],
      ['上传分集', '/creator'],
      ['上传素材', '/creator'],
      ['提交审核', '/creator'],
      ['我的内容', '/creator'],
      ['我的服务订单', '/services'],
      ['数据面板', '/profile'],
      ['方案权益', '/pricing'],
      ['联系支持', '/services'],
      ...(highTier
        ? [
            ['Motion Poster', '/services'],
            ['TikTok Promo Pack', '/services'],
            ['推荐位申请', '/creator'],
            ['收益 / 结算', '/profile'],
            ['优先支持', '/services'],
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
