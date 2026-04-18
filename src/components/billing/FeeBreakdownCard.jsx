import { formatUsd } from '../../data/monetization';

export function FeeBreakdownCard({ gross = 0, deductions = 0, net = 0 }) {
  return (
    <article className="mini-card">
      <h4>Fee Breakdown</h4>
      <p className="small-text">Gross income: {formatUsd(gross)}</p>
      <p className="small-text">Deductions (services + commission): {formatUsd(deductions)}</p>
      <p className="small-text">Net payout estimate: {formatUsd(net)}</p>
    </article>
  );
}
