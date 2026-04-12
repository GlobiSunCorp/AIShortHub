export function DashboardStatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="small-text">{label}</p>
      <h3>{value}</h3>
      <span className="status ok">Live module</span>
    </div>
  );
}
