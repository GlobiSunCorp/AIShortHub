import { Link } from '../../lib/router';
import { BillingExplainerCard } from './BillingExplainerCard';

export function HowPricingWorksPanel({ viewerSummary, creatorSummary }) {
  return (
    <section className="panel stack-md">
      <h3>How Pricing Works</h3>
      <div className="grid cards-2">
        <BillingExplainerCard
          title="For viewers"
          bullets={[
            `Subscription unlock: ${viewerSummary.unlocks}`,
            viewerSummary.stillPaid,
            'Free preview means trailer + designated preview episodes can be watched before paying.',
          ]}
        />
        <BillingExplainerCard
          title="For creators"
          bullets={[
            creatorSummary.monthlyFeeCovers,
            creatorSummary.commissionRule,
            'Platform commission is different from optional add-on service fees.',
            'Revenue sources include subscription pool share, ad revenue share, title sales, and episode unlock sales.',
          ]}
          footer="See refund and commission policy for exact charge timing."
        />
      </div>
      <p className="small-text">Cross-links: <Link className="text-link" to="/faq">FAQ</Link> · <Link className="text-link" to="/refund">Refund / Commission policy</Link></p>
    </section>
  );
}
