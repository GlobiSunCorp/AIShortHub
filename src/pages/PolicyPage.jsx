import { REFUND_POLICY_CONFIG } from '../data/monetization';

const policies = {
  terms: {
    title: 'Terms of Service',
    points: ['Use lawful content only.', 'No IP infringement, impersonation, or fraud.', 'Accounts may be suspended for policy violations.', 'Paid benefits are tied to active account state.'],
  },
  privacy: {
    title: 'Privacy Policy',
    points: ['We store account/profile/order/payment metadata for operations.', 'We minimize sensitive data and use third-party processors like Supabase/Stripe.', 'Users may request data export/deletion subject to legal obligations.'],
  },
  refund: {
    title: 'Refund Matrix',
    modules: [REFUND_POLICY_CONFIG.viewer, REFUND_POLICY_CONFIG.creator, REFUND_POLICY_CONFIG.addon],
  },
  creatorGuidelines: {
    title: 'Creator Guidelines',
    points: ['Provide complete metadata and truthful ownership statements.', 'Upload poster/thumbnail/trailer with platform-safe standards.', 'No hate/violence exploitation/illegal promotion.', 'Episodes must match declared language and synopsis.'],
  },
  contentPolicy: {
    title: 'Content Policy',
    points: ['Statuses: draft, pending_review, approved/published, rejected.', 'Flagged/report_count placeholders support future trust & safety tools.', 'Repeated severe violations may cause payout hold and account removal.'],
  },
  commissionPayout: {
    title: 'Commission & Payout Policy',
    points: ['Default platform take-rate is 20% unless creator plan specifies otherwise.', 'Creator Pro / Studio may get discounted commission rules.', 'Payouts are settled monthly after dispute/risk checks.', 'Service orders are billed separately from revenue sharing.'],
  },
};

export function PolicyPage({ type = 'terms' }) {
  const policy = policies[type] || policies.terms;
  return (
    <section className="panel stack-md">
      <h1>{policy.title}</h1>
      {policy.modules ? (
        <div className="grid cards-3">
          {policy.modules.map((item) => (
            <article key={item.title} className="mini-card stack-sm">
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
        <ul>
          {policy.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
