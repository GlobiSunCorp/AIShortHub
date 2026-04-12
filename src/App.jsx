import React, { useMemo, useState } from "react";
import {
  Play,
  Upload,
  Search,
  Star,
  ChevronRight,
  User,
  LayoutDashboard,
  Film,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import "./index.css";

const seriesData = [
  {
    id: "hidden-return",
    title: "Her Hidden Return",
    genres: ["Romance", "Revenge"],
    episodes: 24,
    subtitle: "English Subtitles",
    hook: "She lost everything once. This time, she returns to take it all back.",
    synopsis:
      "After years of silence, Elena returns under a new identity to confront the family that destroyed her life. But revenge becomes dangerous when love, secrets, and ambition collide in the heart of the city.",
    creator: "Aurora Frame Studio",
    freeEpisodes: 3,
    whyWatch: [
      "A fierce revenge story with high emotional tension",
      "Secrets, betrayal, and shifting identities in every episode",
      "Fast-paced short-form drama designed for binge viewing",
    ],
    characters: [
      ["Elena Vale", "A woman who returns with a new identity and a carefully planned revenge."],
      ["Adrian Cross", "The powerful heir caught between loyalty, guilt, and desire."],
      ["Vivian Hart", "A polished socialite hiding more fear than confidence."],
    ],
    episodeNames: [
      "The Return",
      "A Familiar Enemy",
      "The Invitation",
      "Locked Door",
      "Hidden Name",
      "Silent Toast",
    ],
  },
  {
    id: "dukes-promise",
    title: "The Duke’s Last Promise",
    genres: ["Historical", "Drama"],
    episodes: 18,
    subtitle: "English Subtitles",
    hook: "A promise made in secret becomes the start of a dangerous obsession.",
    synopsis:
      "A nobleman bound by duty finds his fate entangled with a woman whose silence hides a political secret. In a house where every smile is calculated, one promise changes everything.",
    creator: "North Lantern Pictures",
    freeEpisodes: 2,
    whyWatch: [
      "Elegant period styling with sharp emotional stakes",
      "Political intrigue blended with forbidden romance",
      "Short episodes built for strong cliffhangers",
    ],
    characters: [
      ["Duke Alaric", "A nobleman balancing family duty and private longing."],
      ["Lady Mirelle", "A quiet strategist with more influence than anyone suspects."],
      ["Count Varon", "A smiling rival who never wastes a weakness."],
    ],
    episodeNames: ["The Vow", "The Banquet", "A Sealed Letter", "Winter Staircase"],
  },
  {
    id: "contract-bride",
    title: "Contract Bride, Real Revenge",
    genres: ["Urban", "Romance"],
    episodes: 30,
    subtitle: "English Subtitles",
    hook: "A fake marriage deal turns into a brutal game of power and desire.",
    synopsis:
      "When a desperate deal forces two enemies into a public marriage, hidden agendas begin to crack. What starts as strategy becomes a dangerous test of loyalty and pride.",
    creator: "Glass City Motion",
    freeEpisodes: 3,
    whyWatch: [
      "Sharp chemistry and constant power reversals",
      "Modern short-drama pacing with strong visual hooks",
      "Built around cliffhangers and emotional escalation",
    ],
    characters: [
      ["Lena Shaw", "A smart negotiator playing the role of a lifetime."],
      ["Damon Reed", "A cold executive who underestimates her from the start."],
      ["Mira Cole", "The observer who knows where every secret is buried."],
    ],
    episodeNames: ["Signed", "House Rules", "The Public Smile", "Terms Changed"],
  },
  {
    id: "crimson-veil",
    title: "Beneath the Crimson Veil",
    genres: ["Fantasy", "Mystery"],
    episodes: 20,
    subtitle: "English Subtitles",
    hook: "Behind the royal mask lies a secret no one was meant to uncover.",
    synopsis:
      "A masked court, a vanished bloodline, and a forbidden relic pull a reluctant heroine into a kingdom built on illusion and fear.",
    creator: "Velvet Myth Studio",
    freeEpisodes: 2,
    whyWatch: [
      "Fantasy intrigue with a premium mood",
      "Mystery-first storytelling in short serialized form",
      "Strong platform-ready cover and teaser potential",
    ],
    characters: [
      ["Lyra", "A survivor whose memory hides the kingdom’s missing truth."],
      ["Prince Rowan", "A guarded heir trapped by ritual and suspicion."],
      ["The Archivist", "A keeper of secrets who never speaks plainly."],
    ],
    episodeNames: ["Red Hall", "The Masked Prayer", "An Empty Throne", "The Archive Door"],
  },
];

const creatorRows = [
  {
    title: "Her Hidden Return",
    status: "Published",
    episodes: 24,
    date: "2026-04-09",
    promo: "Promotion Active",
  },
  {
    title: "Midnight Agreement",
    status: "Under Review",
    episodes: 12,
    date: "2026-04-10",
    promo: "Pending",
  },
  {
    title: "Queen of the Broken City",
    status: "Needs Revision",
    episodes: 14,
    date: "2026-04-08",
    promo: "Not Started",
  },
];

const adminRows = [
  { title: "Midnight Agreement", creator: "Silver Alley Lab", episodes: 12, action: "Approve" },
  { title: "Ashes of the Velvet House", creator: "North Lantern Pictures", episodes: 26, action: "Request Fix" },
  { title: "Love After the Scandal", creator: "Aurora Frame Studio", episodes: 22, action: "Publish" },
];

const pricing = [
  {
    name: "Listing Setup",
    price: "$49",
    items: ["Series review", "Platform listing", "Basic metadata setup", "Cover placement"],
  },
  {
    name: "Growth Pack",
    price: "$149",
    items: ["Listing setup", "Title optimization", "Cover recommendations", "Detail page packaging"],
  },
  {
    name: "Distribution Pack",
    price: "Custom Quote",
    items: ["Everything in Growth Pack", "Promotion support", "Traffic testing", "Performance feedback"],
  },
];

function Poster({ title, meta, compact = false }) {
  return (
    <div className="poster-card">
      <div className={`poster-media ${compact ? "compact" : ""}`} />
      <div className="poster-title">{title}</div>
      <div className="poster-meta">{meta}</div>
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className="section-title-wrap">
      <h2>{title}</h2>
      {desc ? <p>{desc}</p> : null}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedSeriesId, setSelectedSeriesId] = useState(seriesData[0].id);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [search, setSearch] = useState("");

  const selectedSeries = useMemo(
    () => seriesData.find((s) => s.id === selectedSeriesId) || seriesData[0],
    [selectedSeriesId]
  );

  const filteredSeries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return seriesData;
    return seriesData.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.genres.join(" ").toLowerCase().includes(q) ||
        s.hook.toLowerCase().includes(q)
    );
  }, [search]);

  const openSeries = (id) => {
    setSelectedSeriesId(id);
    setSelectedEpisode(1);
    setPage("detail");
  };

  const goWatch = (id, episode = 1) => {
    setSelectedSeriesId(id);
    setSelectedEpisode(episode);
    setPage("watch");
  };

  const statusClass = (status) => {
    if (status === "Published") return "badge green";
    if (status === "Under Review") return "badge yellow";
    if (status === "Needs Revision") return "badge red";
    return "badge";
  };

  const navItems = [
    ["Home", "home"],
    ["Browse", "browse"],
    ["Submit", "submit"],
    ["Creator Dashboard", "creator"],
    ["Pricing", "pricing"],
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <button onClick={() => setPage("home")} className="brand-btn">
            AIShortHub
          </button>

          <nav className="top-nav">
            {navItems.map(([label, key]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={page === key ? "nav-btn active" : "nav-btn"}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button className="btn btn-outline">Login</button>
            <button onClick={() => setPage("submit")} className="btn btn-light">
              Upload Your Series
            </button>
          </div>
        </div>
      </header>

      <main className="container page-content">
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="pill">Curated AI short dramas</div>
                <h1>Watch and Publish the Next Wave of AI Short Dramas</h1>
                <p>
                  AIShortHub is a curated platform for AI short dramas — built for viewers to
                  discover compelling short-form stories and for creators to publish, package,
                  and grow their series.
                </p>

                <div className="button-row">
                  <button onClick={() => setPage("browse")} className="btn btn-light">
                    Start Watching
                  </button>
                  <button onClick={() => setPage("submit")} className="btn btn-outline">
                    Submit Your Series
                  </button>
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
                      <button onClick={() => goWatch(item.id, 1)} className="btn btn-outline small">
                        Watch Now
                      </button>
                      <button onClick={() => openSeries(item.id)} className="btn btn-outline small">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="feature-strip">
              <div className="info-card">
                <Upload size={22} />
                <h3>Curated Publishing</h3>
                <p>We review and present selected AI short dramas in a clean, premium short-drama format.</p>
              </div>
              <div className="info-card">
                <Star size={22} />
                <h3>Better Positioning</h3>
                <p>We help improve titles, summaries, covers, and detail pages to make your series more clickable and platform-ready.</p>
              </div>
              <div className="info-card">
                <LayoutDashboard size={22} />
                <h3>Promotion Support</h3>
                <p>Selected creators can access optional support for promo packaging, traffic testing, and growth-focused distribution.</p>
              </div>
            </section>
          </>
        )}

        {page === "browse" && (
          <section className="section-block">
            <SectionTitle title="Browse Series" desc="Discover curated AI short dramas by genre, mood, and popularity." />

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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search series, genre, or hook"
                />
              </div>
            </div>

            <div className="card-grid four">
              {filteredSeries.map((item) => (
                <div key={item.id} className="content-card">
                  <div className="content-cover" />
                  <div className="card-title">{item.title}</div>
                  <div className="card-meta">{item.genres.join(" • ")} • {item.episodes} Episodes</div>
                  <div className="card-text">{item.hook}</div>
                  <button onClick={() => openSeries(item.id)} className="btn btn-light small">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "detail" && (
          <section className="detail-layout">
            <div className="detail-poster" />
            <div className="detail-main">
              <div className="detail-meta">
                {selectedSeries.genres.join(" • ")} • {selectedSeries.episodes} Episodes • {selectedSeries.subtitle}
              </div>
              <h2>{selectedSeries.title}</h2>
              <p className="lead-text">{selectedSeries.hook}</p>

              <div className="button-row">
                <button onClick={() => goWatch(selectedSeries.id, 1)} className="btn btn-light">
                  Watch Episode 1
                </button>
                <button className="btn btn-outline">Add to Watchlist</button>
              </div>

              <div className="subtle-text">First {selectedSeries.freeEpisodes} episodes free</div>

              <div className="panel">
                <h3>Synopsis</h3>
                <p>{selectedSeries.synopsis}</p>
              </div>

              <div className="two-col">
                <div className="panel">
                  <h3>Why Watch</h3>
                  <ul className="icon-list">
                    {selectedSeries.whyWatch.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="panel">
                  <h3>Creator / Studio</h3>
                  <p>Submitted by {selectedSeries.creator}</p>
                  <button onClick={() => setPage("submit")} className="btn btn-outline small top-gap">
                    Submit Your Series
                  </button>
                </div>
              </div>

              <div className="panel">
                <h3>Episodes</h3>
                <div className="episode-grid">
                  {selectedSeries.episodeNames.map((ep, i) => (
                    <button key={ep} onClick={() => goWatch(selectedSeries.id, i + 1)} className="episode-btn">
                      <span>Episode {i + 1} — {ep}</span>
                      <span>Watch</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h3>Main Characters</h3>
                <div className="card-grid three">
                  {selectedSeries.characters.map(([name, desc]) => (
                    <div key={name} className="mini-card">
                      <div className="mini-card-title">{name}</div>
                      <div className="mini-card-text">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {page === "watch" && (
          <section className="watch-layout">
            <div className="watch-main">
              <button onClick={() => setPage("detail")} className="back-link">
                <ArrowLeft size={16} /> Back to Series
              </button>

              <div className="player-shell">
                <div className="fake-player">
                  <Play size={54} />
                  <div className="player-title">Episode {selectedEpisode}</div>
                  <div className="player-subtitle">{selectedSeries.title}</div>
                </div>

                <div className="watch-head">
                  <div>
                    <h3>Episode {selectedEpisode} — {selectedSeries.episodeNames[(selectedEpisode - 1) % selectedSeries.episodeNames.length]}</h3>
                    <div className="subtle-text">Series: {selectedSeries.title}</div>
                  </div>

                  <div className="button-row">
                    <button onClick={() => setSelectedEpisode(Math.max(1, selectedEpisode - 1))} className="btn btn-outline icon-btn">
                      <ArrowLeft size={16} />
                    </button>
                    <button onClick={() => setSelectedEpisode(Math.min(selectedSeries.episodes, selectedEpisode + 1))} className="btn btn-outline icon-btn">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {selectedEpisode > selectedSeries.freeEpisodes && (
                  <div className="gate-box">
                    <h3>Continue Watching</h3>
                    <p>Create an account to continue this series and unlock more curated AI dramas.</p>
                    <div className="button-row">
                      <button className="btn btn-light">Sign Up</button>
                      <button className="btn btn-outline">Log In</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="watch-side">
              <div className="panel">
                <h3>Episode List</h3>
                <div className="episode-list">
                  {Array.from({ length: Math.min(selectedSeries.episodes, 10) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEpisode(i + 1)}
                      className={selectedEpisode === i + 1 ? "episode-list-btn active" : "episode-list-btn"}
                    >
                      <span>Episode {i + 1}</span>
                      <span>{i + 1 <= selectedSeries.freeEpisodes ? "Free" : "Locked"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h3>More Like This</h3>
                <div className="side-list">
                  {seriesData.filter((s) => s.id !== selectedSeries.id).slice(0, 3).map((item) => (
                    <button key={item.id} onClick={() => openSeries(item.id)} className="side-item">
                      <div className="side-thumb" />
                      <div>
                        <div className="side-title">{item.title}</div>
                        <div className="side-meta">{item.genres.join(" • ")}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        )}

        {page === "submit" && (
          <section className="submit-layout">
            <div className="submit-head">
              <div className="pill">Creator Submission</div>
              <h2>Submit Your AI Short Drama</h2>
              <p>Send us your finished series for review, publishing, and optional promotion support on AIShortHub.</p>
            </div>

            <div className="two-col submit-grid">
              <div className="stack-col">
                {[
                  ["What you can submit", "We accept completed AI short dramas, serialized story content, trailers, and teaser materials intended for short-form video audiences."],
                  ["What we review", "Our team reviews each submission for story clarity, visual consistency, technical format, and overall fit for the AIShortHub platform."],
                  ["Optional support", "Selected creators may request help with listing setup, title refinement, cover positioning, and promotional distribution support."],
                ].map(([title, desc]) => (
                  <div key={title} className="panel">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>

              <div className="panel form-panel">
                <div className="form-grid">
                  {[
                    "Series Title",
                    "Genre",
                    "Language",
                    "Number of Episodes",
                    "Total Runtime",
                    "Creator / Studio Name",
                    "Contact Email",
                    "Short Synopsis",
                    "Main Selling Point",
                    "Target Audience",
                    "Existing Trailer Link",
                    "Video Upload or Drive Link",
                    "Cover Upload",
                  ].map((field) => (
                    <div key={field} className="form-field">
                      <label>{field}</label>
                      <div className="fake-input" />
                    </div>
                  ))}
                </div>

                <div className="check-group">
                  <label><input type="checkbox" /> I confirm that I own or control the rights necessary to submit this content.</label>
                  <label><input type="checkbox" /> I confirm that the submitted materials do not knowingly infringe third-party rights.</label>
                  <label><input type="checkbox" /> I agree to the AIShortHub review and publishing policy.</label>
                </div>

                <button className="btn btn-light">Submit for Review</button>
              </div>
            </div>
          </section>
        )}

        {page === "creator" && (
          <section className="section-block">
            <SectionTitle title="Creator Dashboard" desc="Manage your submitted series and track review and publishing progress." />

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
                <button onClick={() => setPage("submit")} className="btn btn-light small">
                  Submit New Series
                </button>
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
                        <td><span className={statusClass(row.status)}>{row.status}</span></td>
                        <td>{row.episodes}</td>
                        <td>{row.date}</td>
                        <td>{row.promo}</td>
                        <td><button className="btn btn-outline small">View</button></td>
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
                      <span><Icon size={16} /> {label}</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {page === "pricing" && (
          <section className="section-block">
            <SectionTitle title="Creator Services" desc="Choose the level of publishing and promotion support that fits your series." />
            <div className="card-grid three">
              {pricing.map((plan, idx) => (
                <div key={plan.name} className={idx === 1 ? "price-card featured" : "price-card"}>
                  <h3>{plan.name}</h3>
                  <div className="price-value">{plan.price}</div>
                  <div className="stack-col">
                    {plan.items.map((item) => (
                      <div key={item} className="price-item">
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button className={idx === 1 ? "btn btn-light top-gap" : "btn btn-outline top-gap"}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "admin" && (
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
                        <td><button className="btn btn-light small">Open</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">AIShortHub</div>
            <p>Curated AI short dramas for viewers and creators.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <div className="footer-list">
              <div>Browse</div>
              <div>Submit</div>
              <div>Creator Services</div>
            </div>
          </div>
          <div>
            <h4>Legal</h4>
            <div className="footer-list">
              <div>Terms of Use</div>
              <div>Privacy Policy</div>
              <div>Copyright Policy</div>
            </div>
          </div>
          <div>
            <h4>Internal Demo</h4>
            <div className="button-row wrap">
              <button onClick={() => setPage("creator")} className="btn btn-outline small">Creator</button>
              <button onClick={() => setPage("admin")} className="btn btn-outline small">Admin</button>
              <button onClick={() => setPage("pricing")} className="btn btn-outline small">Pricing</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
