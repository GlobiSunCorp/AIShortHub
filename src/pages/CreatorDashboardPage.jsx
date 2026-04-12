import { CheckCircle2, ChevronRight, Clock3, Film, Star, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { creatorRows } from "../data/dashboard";
import { getStatusClass } from "../lib/status";

export default function CreatorDashboardPage() {
  return (
    <section className="section-block">
      <SectionTitle
        title="Creator Dashboard"
        desc="Manage your submitted series and track review and publishing progress."
      />

      <div className="card-grid four stats-grid">
        {[
          ["Total Views", "18.4K", Film],
          ["Series Published", "1", CheckCircle2],
          ["Review Pending", "1", Clock3],
          ["Promotion Active", "1", Star],
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
          <h3>Your Series</h3>
          <Link to="/submit" className="btn btn-light small">
            Submit New Series
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Series Title</th>
                <th>Status</th>
                <th>Episodes</th>
                <th>Submitted Date</th>
                <th>Promotion Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorRows.map((row) => (
                <tr key={row.title}>
                  <td>{row.title}</td>
                  <td>
                    <span className={getStatusClass(row.status)}>{row.status}</span>
                  </td>
                  <td>{row.episodes}</td>
                  <td>{row.date}</td>
                  <td>{row.promo}</td>
                  <td>
                    <button className="btn btn-outline small">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="two-col top-gap">
        <div className="panel">
          <h3>Service History</h3>
          <div className="stack-col">
            <div className="soft-box">Listing Setup — Completed</div>
            <div className="soft-box">Cover Optimization — In Progress</div>
            <div className="soft-box">Promotion Support — Active</div>
          </div>
        </div>

        <div className="panel">
          <h3>Quick Actions</h3>
          <div className="stack-col">
            {[
              ["Submit New Series", Upload],
              ["Request Promotion", Star],
              ["Contact Support", User],
            ].map(([label, Icon]) => (
              <button key={label} className="quick-action">
                <span>
                  <Icon size={16} /> {label}
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
