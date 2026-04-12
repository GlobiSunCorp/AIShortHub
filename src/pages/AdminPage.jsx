import { SectionTitle } from '../components/SectionTitle';
import { adminOverviewModules, adminRows } from '../data/admin';

export function AdminPage() {
  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Admin Operations</h1>
        <p>Moderation, publishing queue, featured placement controls, promotion health, and shared infrastructure roadmap.</p>
      </section>

      <section>
        <SectionTitle title="Operations Overview" desc="Cross-team status modules for daily release orchestration." />
        <div className="grid cards-3">
          {adminOverviewModules.map((module) => (
            <article key={module.label} className="mini-card">
              <h3>{module.label}</h3>
              <p>{module.value}</p>
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
