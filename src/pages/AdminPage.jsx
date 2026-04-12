import { SectionTitle } from '../components/SectionTitle';
import { adminOverviewModules, adminRows } from '../data/admin';

export function AdminPage() {
  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Admin Operations</h1>
        <p>
          Moderate creator submissions, manage featured placement, and keep release pipelines healthy across growth and monetization.
        </p>
      </section>

      <section>
        <SectionTitle title="Operations Overview" desc="Cross-team health modules for daily release orchestration." />
        <div className="grid cards-3">
          {adminOverviewModules.map((module) => (
            <article key={module.label} className="dashboard-module">
              <h3>{module.label}</h3>
              <p className="small-text">{module.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Queue ID</th>
              <th>Series</th>
              <th>Creator</th>
              <th>Stage</th>
              <th>Risk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adminRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>{row.creator}</td>
                <td>{row.stage}</td>
                <td>{row.riskFlag}</td>
                <td>{row.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
