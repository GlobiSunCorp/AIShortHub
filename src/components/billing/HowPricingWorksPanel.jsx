import { Link } from '../../lib/router';
import { BillingExplainerCard } from './BillingExplainerCard';
import { GlossaryTerm } from '../GlossaryTerm';

export function HowPricingWorksPanel({ viewerSummary, creatorSummary }) {
  return (
    <section className="panel ds-section">
      <h3 className="ds-h3">Billing & earnings clarity</h3>
      <div className="grid cards-2">
        <BillingExplainerCard
          title="For viewers: what you pay"
          bullets={[
            `Subscription unlocks: ${viewerSummary.unlocks}`,
            viewerSummary.stillPaid,
            'Trailer and preview episodes can stay free while paid episodes remain clearly marked.',
          ]}
          footer="If a title is creator-priced, you can still unlock only one episode instead of full title."
        />
        <BillingExplainerCard
          title="For creators: what you keep"
          bullets={[
            creatorSummary.monthlyFeeCovers,
            creatorSummary.commissionRule,
            'Commission and optional add-on service fees are separate lines.',
            'Commission applies only after creator revenue exists.',
          ]}
          footer="Net payout = creator revenue - platform commission - optional service fees."
        />
      </div>
      <p className="small-text">Key terms: platform commission <GlossaryTerm id="platform_commission" /> · subscription pool <GlossaryTerm id="subscription_pool_share" /> · pending payout <GlossaryTerm id="pending_payout" /></p>
      <p className="small-text">Cross-links: <Link className="text-link" to="/faq">FAQ</Link> · <Link className="text-link" to="/refund">Refund policy</Link></p>
    </section>
  );
}
