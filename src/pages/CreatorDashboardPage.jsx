import { DashboardStatCard } from '../components/DashboardStatCard';
import { SectionTitle } from '../components/SectionTitle';
import { SubmissionInfoCard } from '../components/SubmissionInfoCard';
import { creatorPlatformModules, creatorRows, creatorStats } from '../data/creator';

export function CreatorDashboardPage() {
  return (
    <div className="stack-lg">
      <section className="panel">
        <SectionTitle title="Creator Command Center" desc="Track submissions, release readiness, and monetization health in one premium workspace." />
      </section>

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
        <SectionTitle title="Platform Modules" desc="Roadmap modules wired for data integrations and campaign automation." />
        <div className="grid cards-3">
          {creatorPlatformModules.map((module) => (
            <article key={module.name} className="dashboard-module">
              <h3>{module.name}</h3>
              <p className="small-text">{module.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
