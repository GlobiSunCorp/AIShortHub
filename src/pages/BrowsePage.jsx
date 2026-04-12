import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { seriesData } from "../data/series";

export default function BrowsePage() {
  const [search, setSearch] = useState("");

  const filteredSeries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return seriesData;
    return seriesData.filter(
      (series) =>
        series.title.toLowerCase().includes(q) ||
        series.genres.join(" ").toLowerCase().includes(q) ||
        series.hook.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <section className="section-block">
      <SectionTitle
        title="Browse Series"
        desc="Discover curated AI short dramas by genre, mood, and popularity."
      />

      <div className="toolbar">
        <div className="genre-tags">
          {["All", "Romance", "Revenge", "Fantasy", "Thriller", "Historical", "Urban Drama", "Mystery"].map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>

        <div className="search-box">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search series, genre, or hook"
          />
        </div>
      </div>

      <div className="card-grid four">
        {filteredSeries.map((item) => (
          <div key={item.id} className="content-card">
            <div className="content-cover" />
            <div className="card-title">{item.title}</div>
            <div className="card-meta">
              {item.genres.join(" • ")} • {item.episodes} Episodes
            </div>
            <div className="card-text">{item.hook}</div>
            <Link to={`/series/${item.id}`} className="btn btn-light small">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
