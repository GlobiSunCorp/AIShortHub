import { formatUsd } from '../../data/monetization';

export function RevenueFlowDiagram({ lines = [], netPayout = 0 }) {
  const totalPositive = lines.filter(([, value]) => value > 0).reduce((sum, [, value]) => sum + value, 0) || 1;
  return (
    <article className="mini-card stack-sm">
      <h4>Revenue Logic Breakdown</h4>
      <div className="stack-sm">
        {lines.map(([label, value]) => (
          <div key={label}>
            <div className="row between"><span className="small-text">{label}</span><span className={`small-text ${value < 0 ? 'text-danger' : 'text-success'}`}>{value < 0 ? '-' : '+'}{formatUsd(Math.abs(value))}</span></div>
            <div className="meter"><span style={{ width: `${Math.max((Math.abs(value) / totalPositive) * 100, 4)}%` }} /></div>
          </div>
        ))}
      </div>
      <p className="small-text">Money in → deductions → <strong>Net payout {formatUsd(netPayout)}</strong>.</p>
    </article>
  );
}
