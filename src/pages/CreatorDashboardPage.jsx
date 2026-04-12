import { DashboardStatCard } from '../components/DashboardStatCard';
import { SectionTitle } from '../components/SectionTitle';
import { SubmissionInfoCard } from '../components/SubmissionInfoCard';
import { creatorPlatformModules, creatorRows, creatorStats } from '../data/creator';

export function CreatorDashboardPage() {
  return (
    <div className="stack-lg">
      <SectionTitle title="Creator Dashboard" desc="Submission pipeline, distribution modules, and promotion health." />
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

      <section>
        <SectionTitle title="Platform Modules" desc="Placeholder modules wired for future APIs and automation." />
        <div className="grid cards-3">
          {creatorPlatformModules.map((module) => (
            <article key={module.name} className="mini-card">
              <h3>{module.name}</h3>
              <p>{module.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
