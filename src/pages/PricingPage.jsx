import { PricingCard } from '../components/PricingCard';
import { SectionTitle } from '../components/SectionTitle';
import { billingEntries, pricingPlans } from '../data/pricing';

export function PricingPage() {
  return (
    <div className="stack-lg">
      <SectionTitle title="Pricing & Unlock" desc="Subscription, credits, creator service, and billing entry points." />
      <div className="grid cards-3">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
      <section className="panel">
        <h3>Billing / Orders / Invoice (Future integration)</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {billingEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.item}</td>
                  <td>{entry.amount}</td>
                  <td>{entry.status}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
