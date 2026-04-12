import { DashboardStatCard } from '../components/DashboardStatCard';
import { SectionTitle } from '../components/SectionTitle';
import { SubmissionInfoCard } from '../components/SubmissionInfoCard';
import { creatorRows, creatorStats } from '../data/creator';

export function CreatorDashboardPage() {
  return (
    <div className="stack-lg">
      <SectionTitle title="Creator Dashboard" desc="Submission, traffic, promotion, and service status." />
      <div className="grid cards-4">
        {creatorStats.map((stat) => (
          <DashboardStatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <section className="grid cards-3">
        {creatorRows.map((row) => (
          <SubmissionInfoCard key={row.id} item={row} />
        ))}
      </section>

      <section className="panel">
        <h3>Distribution / Traffic / Promotion (Future API slots)</h3>
        <div className="grid cards-3">
          <div className="mini-card">
            <p>TikTok campaign status</p>
            <h4>3 Running · 2 Queued</h4>
          </div>
          <div className="mini-card">
            <p>Short links / referral tracking</p>
            <h4>tthub.io/r/hidden-return</h4>
          </div>
          <div className="mini-card">
            <p>Ad performance</p>
            <h4>CTR 3.8% · View→Register 6.2%</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
