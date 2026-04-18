import { useMemo, useState } from 'react';

const GUIDE = {
  viewer: {
    title: 'Viewer Quick Start',
    steps: [
      '先去 Browse 浏览剧集，预告和试看集无需会员。',
      '试看后可选择开通 Viewer Subscription，解锁完整内容。',
      '不订阅也可按整剧或单集付费解锁。',
      '在 Profile 查看当前方案、续费日期和账单记录。',
    ],
  },
  creator: {
    title: 'Creator Quick Start',
    steps: [
      '先选 Creator Plan：月费用于工具和额度，不等于收入抽成。',
      '在 Creator Studio 上传 Trailer 与 Main Episodes。',
      '设置整剧价、单集价与试看集，再提交审核。',
      '在收益面板查看广告分成、订阅池分成和净收益。',
    ],
  },
  admin: {
    title: 'Admin Quick Start',
    steps: [
      'Review Queue 处理待审内容并留审核备注。',
      '服务订单区更新状态并记录交付备注。',
      '关注 creator 收益和投诉/举报处理节奏。',
      '按 Launch Checklist 完成软上线与生产切换。',
    ],
  },
};

export function OnboardingGuide({ role = 'viewer', storageKey = 'aishorthub-onboarding' }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(`${storageKey}-${role}`) === 'done';
  });
  const guide = useMemo(() => GUIDE[role] || GUIDE.viewer, [role]);

  if (dismissed) return null;

  return (
    <section className="panel stack-md onboarding-card">
      <div className="row split wrap">
        <h3>{guide.title}</h3>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setDismissed(true);
            if (typeof window !== 'undefined') window.localStorage.setItem(`${storageKey}-${role}`, 'done');
          }}
        >
          Got it
        </button>
      </div>
      <ol>
        {guide.steps.map((item) => <li key={item} className="small-text">{item}</li>)}
      </ol>
    </section>
  );
}
