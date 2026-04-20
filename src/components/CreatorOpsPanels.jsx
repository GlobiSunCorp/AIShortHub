import { UsageQuotaBadge } from './EntitlementBadges';

export function QuotaAlertBar({ alerts = [], compact = false, onAction }) {
  return (
    <section className={`panel quota-alert-bar ${compact ? 'compact' : ''}`.trim()}>
      <div className="quota-alert-list">
        {alerts.map((alert) => (
          <article key={alert.key} className={`quota-alert-item ${alert.state}`}>
            <p>{alert.message}</p>
            <button type="button" className="btn btn-ghost btn-cta-secondary" onClick={() => onAction?.(alert.cta)}>{alert.cta}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PlanHealthCard({ data, hoverHint }) {
  const statusTone = data.healthStatus === 'Action Needed' ? 'error' : data.healthStatus === 'Near Limit' ? 'warn' : 'ok';

  return (
    <section className="panel plan-health-card stack-md" title={hoverHint}>
      <div className="row split wrap">
        <div>
          <p className="kicker">Plan Health</p>
          <h3>Operational Health Overview</h3>
          <p className="small-text">{data.cycleLabel}</p>
        </div>
        <span className={`status ${statusTone}`}>{data.healthStatus}</span>
      </div>
      <div className="row wrap">
        {data.metrics.map((item) => <UsageQuotaBadge key={item.label} label={item.label} value={item.value} tone={item.tone || 'normal'} details={item.details} />)}
      </div>
      <div className="grid cards-3">
        {data.summary.map(([label, value]) => (
          <article className="mini-card" key={label}>
            <p className="small-text">{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CreatorActionCenter({ actions = [], onAction }) {
  const groups = {
    urgent: actions.filter((item) => item.level === 'urgent'),
    recommended: actions.filter((item) => item.level === 'recommended'),
    informational: actions.filter((item) => item.level === 'informational'),
  };

  return (
    <section className="panel stack-md">
      <h3>Creator Action Center</h3>
      {!actions.length ? <p className="small-text">All clear. No immediate actions required this cycle.</p> : null}
      {Object.entries(groups).map(([level, items]) => (
        <div key={level} className="stack-md">
          {items.length ? <p className="kicker">{level}</p> : null}
          {items.map((item) => (
            <article key={`${level}-${item.title}`} className={`action-item ${level}`}>
              <p>{item.title}</p>
              <button type="button" className="btn btn-ghost btn-cta-secondary" onClick={() => onAction?.(item.cta)}>{item.cta}</button>
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}

export function SubmissionReadinessChecklist({ checklist }) {
  return (
    <section className="panel stack-md">
      <h3>Submission Readiness Checklist</h3>
      <span className={`status ${checklist.status === 'ready to submit' ? 'ok' : checklist.status === 'upgrade recommended' ? 'warn' : ''}`}>{checklist.status}</span>
      <div className="stack-md">
        {checklist.items.map(([label, done, note]) => (
          <article key={label} className={`check-item ${done ? 'done' : 'missing'}`}>
            <div>
              <strong>{done ? '✓' : '✕'} {label}</strong>
              <p className="small-text">{note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
