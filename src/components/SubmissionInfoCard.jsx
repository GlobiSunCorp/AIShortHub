export function SubmissionInfoCard({ item }) {
  return (
    <article className="submission-card">
      <h3>{item.title}</h3>
      <div className="row split small-text">
        <span className="status">{item.status}</span>
        <span>{item.submittedAt}</span>
      </div>
      <p>{item.reviewNote}</p>
      <dl>
        <dt>Service</dt>
        <dd>{item.serviceStatus}</dd>
        <dt>Distribution</dt>
        <dd>{item.distributionStatus}</dd>
        <dt>Promotion</dt>
        <dd>{item.promotionStatus}</dd>
      </dl>
      <button className="text-link">Open details →</button>
    </article>
  );
}
