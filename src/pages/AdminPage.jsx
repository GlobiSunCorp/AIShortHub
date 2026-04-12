import { adminRows } from '../data/admin';

export function AdminPage() {
  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Admin Operations</h1>
        <p>Moderation, recommendation placement, promotion workflow, and campaign quality control.</p>
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
