import { LayoutDashboard, Play, Star, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import Poster from "../components/Poster";
import SectionTitle from "../components/SectionTitle";
import { seriesData } from "../data/series";

export default function HomePage() {

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="pill">Curated AI short dramas</div>
          <h1>Watch and Publish the Next Wave of AI Short Dramas</h1>
          <p>
            AIShortHub is a curated platform for AI short dramas — built for viewers to discover
            compelling short-form stories and for creators to publish, package, and grow their
            series.
          </p>

          <div className="button-row">
            <Link to="/browse" className="btn btn-light">
              Start Watching
            </Link>
            <Link to="/submit" className="btn btn-outline">
              Submit Your Series
            </Link>
          </div>

          <div className="tag-row">
            <span>Curated series</span>
            <span>Short-form storytelling</span>
            <span>Creator-friendly publishing</span>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-feature">
            <div className="hero-poster">
              <Play size={42} />
            </div>
            <div className="mini-meta">Romance • Revenge • 24 Episodes</div>
            <div className="hero-title">Her Hidden Return</div>
            <div className="hero-text">She came back with a new name — and a dangerous plan.</div>
          </div>

          <div className="hero-side">
            <Poster title="The Duke’s Last Promise" meta="Historical • Drama" compact />
            <Poster title="Beneath the Crimson Veil" meta="Fantasy • Mystery" compact />
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionTitle title="Trending Now" desc="Curated AI short dramas gaining attention this week." />
        <div className="card-grid four">
          {seriesData.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-cover" />
              <div className="card-title">{item.title}</div>
              <div className="card-meta">
                {item.genres.join(" • ")} • {item.episodes} Episodes
              </div>
              <div className="card-text">{item.hook}</div>
              <div className="button-row">
                <Link to={`/watch/${item.id}/1`} className="btn btn-outline small">
                  Watch Now
                </Link>
                <Link to={`/series/${item.id}`} className="btn btn-outline small">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-strip">
        <div className="info-card">
          <Upload size={22} />
          <h3>Curated Publishing</h3>
          <p>
            We review and present selected AI short dramas in a clean, premium short-drama
            format.
          </p>
        </div>
        <div className="info-card">
          <Star size={22} />
          <h3>Better Positioning</h3>
          <p>
            We help improve titles, summaries, covers, and detail pages to make your series more
            clickable and platform-ready.
          </p>
        </div>
        <div className="info-card">
          <LayoutDashboard size={22} />
          <h3>Promotion Support</h3>
          <p>
            Selected creators can access optional support for promo packaging, traffic testing, and
            growth-focused distribution.
          </p>
        </div>
      </section>
    </>
  );
}
