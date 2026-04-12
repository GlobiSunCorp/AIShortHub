import { AlertCircle, CheckCircle2, Clock3, Film } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { adminRows } from "../data/dashboard";

export default function AdminPage() {
  return (
    <section className="section-block">
      <SectionTitle title="Admin" desc="Internal moderation and content operations panel." />

      <div className="card-grid four stats-grid">
        {[
          ["Total Series", "12", Film],
          ["Pending Review", "3", Clock3],
          ["Published", "7", CheckCircle2],
          ["Needs Attention", "2", AlertCircle],
        ].map(([label, value, Icon]) => (
          <div key={label} className="stat-card">
            <Icon size={20} />
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="panel top-gap">
        <div className="panel-head">
          <h3>Review Queue</h3>
          <button className="btn btn-outline small">Homepage Picks</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Episodes</th>
                <th>Suggested Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {adminRows.map((row) => (
                <tr key={row.title}>
                  <td>{row.title}</td>
                  <td>{row.creator}</td>
                  <td>{row.episodes}</td>
                  <td>{row.action}</td>
                  <td>
                    <button className="btn btn-light small">Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
