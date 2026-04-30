import { REFUND_POLICY_CONFIG } from '../data/monetization';

const policies = {
  terms: {
    title: 'Terms of Service',
    intro: 'Core platform rules for viewers, creators, payments, and AI-powered short video publishing.',
    points: [
      'Use lawful content only.',
      'No IP infringement, impersonation, fraud, or misleading AI-content claims.',
      'AI-powered short videos, trailers, music videos, commercials, animations, product videos, and experimental stories must respect applicable rights and platform safety rules.',
      'Accounts may be suspended for policy violations.',
      'Paid benefits are tied to active account state.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'What account, creator, order, and payment data is stored to keep the platform running.',
    points: [
      'We store account/profile/order/payment metadata for operations.',
      'We may store creator project metadata, asset links, review notes, and service-order history to operate the platform.',
      'We minimize sensitive data and use third-party processors like Supabase/Stripe.',
      'Users may request data export/deletion subject to legal obligations.',
    ],
  },
  refund: {
    title: 'Refund Matrix',
    intro: 'Viewer plans, creator plans, and add-on services follow separate refund logic.',
    modules: [REFUND_POLICY_CONFIG.viewer, REFUND_POLICY_CONFIG.creator, REFUND_POLICY_CONFIG.addon],
  },
  creatorGuidelines: {
    title: 'Creator Guidelines',
    intro: 'Submission standards for AI short projects, creator showcase quality, rights, and safety.',
    points: [
      'Provide complete metadata and truthful ownership / licensing statements.',
      'Upload poster, cover, trailer / teaser, thumbnail, and main video assets with platform-safe standards.',
      'Clearly label commercial/product-video submissions and avoid misleading viewer claims.',
      'No hate, sexual exploitation, excessive gore, illegal promotion, or unsafe real-world instruction.',
      'Videos must match declared language, synopsis, audience rating, and category.',
      'Creators should disclose major AI-generation workflows and confirm rights to music, likeness, voice, brand, and footage where applicable.',
    ],
  },
  contentPolicy: {
    title: 'Content Policy',
    intro: 'How AI shorts, creator uploads, and flagged submissions are reviewed during pilot operations.',
    points: [
      'Statuses: draft, pending_review, approved/published, rejected.',
      'Review applies to AI shorts, trailers, animations, music videos, commercials, product videos, and experimental content.',
      'Flagged/report_count placeholders support future trust & safety tools.',
      'Repeated severe violations may cause payout hold and account removal.',
      'Content with sexual, violent, hateful, deceptive, or rights-risk material may be rejected or require additional review notes.',
    ],
  },
  commissionPayout: {
    title: 'Commission & Payout Policy',
    intro: 'Creator-friendly launch payout logic: low commission, ad-first monetization, and monthly settlement.',
    points: [
      'Creator-friendly launch commissions are 8% / 5% / 3% for Creator Basic / Creator Pro / Studio.',
      'Platform commission applies only after creator-generated revenue exists.',
      'Platform monetization is ad-first with service + subscription + single-title / single-video unlock income in parallel.',
      'Payouts are settled monthly after dispute/risk checks and policy review.',
      'Service orders are billed separately and can appear as creator-side operating costs.',
    ],
  },
};

export function PolicyPage({ type = 'terms' }) {
  const policy = policies[type] || policies.terms;
  return (
    <section className="panel stack-md">
      <p className="kicker">Policy Center</p>
      <h1>{policy.title}</h1>
      <p className="small-text">{policy.intro}</p>
      {policy.modules ? (
        <div className="grid cards-3">
          {policy.modules.map((item) => (
            <article key={item.title} className="mini-card stack-sm" style={{ borderRadius: '24px' }}>
              <h3>{item.title}</h3>
              <p className="small-text">{item.short}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <article className="mini-card" style={{ borderRadius: '24px' }}>
          <ul>
            {policy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      )}
      <article className="mini-card" style={{ borderRadius: '24px' }}>
        <h3>Operator note</h3>
        <p className="small-text">Soft launch should prioritize stable flows, transparent rights disclosure, and professional AI shorts review standards over aggressive growth shortcuts.</p>
      </article>
    </section>
  );
}
