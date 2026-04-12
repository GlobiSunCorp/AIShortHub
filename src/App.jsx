import React, { useMemo, useState } from "react";
import { Play, Upload, Search, Star, ChevronRight, User, LayoutDashboard, Film, Settings, ArrowLeft, ArrowRight, CheckCircle2, Clock3, AlertCircle } from "lucide-react";

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
    color: "from-fuchsia-700/40 to-rose-900/30",
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
    color: "from-amber-700/30 to-neutral-900/40",
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
    color: "from-cyan-700/20 to-neutral-900/40",
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
    color: "from-red-700/30 to-neutral-900/40",
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

function Poster({ title, meta, className = "", compact = false }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-b ${className} p-4 shadow-lg`}>
      <div className={`rounded-2xl border border-white/10 bg-black/25 ${compact ? "h-40" : "h-72"}`} />
      <div className="mt-4 text-lg font-semibold">{title}</div>
      <div className="mt-1 text-xs text-white/55">{meta}</div>
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {desc ? <p className="mt-2 text-sm text-white/60">{desc}</p> : null}
    </div>
  );
}

export default function AIShortHubPrototype() {
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

  const statusBadge = (status) => {
    const map = {
      Published: "bg-emerald-500/15 text-emerald-300",
      "Under Review": "bg-amber-500/15 text-amber-300",
      "Needs Revision": "bg-red-500/15 text-red-300",
      Approved: "bg-sky-500/15 text-sky-300",
    };
    return map[status] || "bg-white/10 text-white/70";
  };

  const navItems = [
    ["Home", "home"],
    ["Browse", "browse"],
    ["Submit", "submit"],
    ["Creator Dashboard", "creator"],
    ["Pricing", "pricing"],
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => setPage("home")} className="text-xl font-semibold tracking-wide">
            AIShortHub
          </button>
          <nav className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
            {navItems.map(([label, key]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`transition hover:text-white ${page === key ? "text-white" : ""}`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden rounded-2xl border border-white/15 px-4 py-2 text-sm md:block">Login</button>
            <button
              onClick={() => setPage("submit")}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black shadow"
            >
              Upload Your Series
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {page === "home" && (
          <div>
            <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <div className="mb-3 inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                  Curated AI short dramas
                </div>
                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                  Watch and Publish the Next Wave of AI Short Dramas
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/70">
                  AIShortHub is a curated platform for AI short dramas — built for viewers to discover compelling short-form stories and for creators to publish, package, and grow their series.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => setPage("browse")} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black">
                    Start Watching
                  </button>
                  <button onClick={() => setPage("submit")} className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium text-white">
                    Submit Your Series
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/50">
                  <span className="rounded-full border border-white/10 px-3 py-1">Curated series</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Short-form storytelling</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Creator-friendly publishing</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-3xl bg-gradient-to-b from-fuchsia-700/40 to-neutral-900 p-5 shadow-2xl">
                  <div className="flex h-72 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                    <Play className="h-12 w-12 text-white/80" />
                  </div>
                  <div className="mt-4 text-xs text-white/60">Romance • Revenge • 24 Episodes</div>
                  <div className="mt-2 text-2xl font-semibold">Her Hidden Return</div>
                  <div className="mt-2 text-sm text-white/70">She came back with a new name — and a dangerous plan.</div>
                </div>
                <div className="space-y-4">
                  <Poster title="The Duke’s Last Promise" meta="Historical • Drama" className="from-amber-700/20 to-neutral-900/10" compact />
                  <Poster title="Beneath the Crimson Veil" meta="Fantasy • Mystery" className="from-red-700/20 to-neutral-900/10" compact />
                </div>
              </div>
            </section>

            <section className="mt-12">
              <SectionTitle title="Trending Now" desc="Curated AI short dramas gaining attention this week." />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {seriesData.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg transition hover:-translate-y-1 hover:bg-white/10">
                    <div className={`mb-4 h-72 rounded-2xl border border-white/10 bg-gradient-to-b ${item.color}`} />
                    <div className="text-lg font-semibold">{item.title}</div>
                    <div className="mt-1 text-xs text-white/50">
                      {item.genres.join(" • ")} • {item.episodes} Episodes
                    </div>
                    <div className="mt-3 text-sm text-white/70">{item.hook}</div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => goWatch(item.id, 1)} className="rounded-2xl border border-white/15 px-4 py-2 text-sm">Watch Now</button>
                      <button onClick={() => openSeries(item.id)} className="rounded-2xl border border-white/15 px-4 py-2 text-sm">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <Upload className="h-6 w-6 text-white/80" />
                <div className="mt-4 text-lg font-semibold">Curated Publishing</div>
                <p className="mt-2 text-sm text-white/65">
                  We review and present selected AI short dramas in a clean, premium short-drama format.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <Star className="h-6 w-6 text-white/80" />
                <div className="mt-4 text-lg font-semibold">Better Positioning</div>
                <p className="mt-2 text-sm text-white/65">
                  We help improve titles, summaries, covers, and detail pages to make your series more clickable and platform-ready.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <LayoutDashboard className="h-6 w-6 text-white/80" />
                <div className="mt-4 text-lg font-semibold">Promotion Support</div>
                <p className="mt-2 text-sm text-white/65">
                  Selected creators can access optional support for promo packaging, traffic testing, and growth-focused distribution.
                </p>
              </div>
            </section>
          </div>
        )}

        {page === "browse" && (
          <section>
            <SectionTitle title="Browse Series" desc="Discover curated AI short dramas by genre, mood, and popularity." />
            <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2 text-sm">
                {["All", "Romance", "Revenge", "Fantasy", "Thriller", "Historical", "Urban Drama", "Mystery"].map((g) => (
                  <span key={g} className="rounded-full border border-white/10 px-3 py-1 text-white/75">{g}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 md:w-80">
                <Search className="h-4 w-4 text-white/45" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search series, genre, or hook"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {filteredSeries.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className={`mb-4 h-72 rounded-2xl border border-white/10 bg-gradient-to-b ${item.color}`} />
                  <div className="text-lg font-semibold">{item.title}</div>
                  <div className="mt-1 text-xs text-white/50">{item.genres.join(" • ")} • {item.episodes} Episodes</div>
                  <div className="mt-3 text-sm text-white/70">{item.hook}</div>
                  <button onClick={() => openSeries(item.id)} className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "detail" && (
          <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-[320px,1fr]">
            <div>
              <div className={`h-[460px] rounded-3xl border border-white/10 bg-gradient-to-b ${selectedSeries.color}`} />
            </div>
            <div>
              <div className="text-sm text-white/50">
                {selectedSeries.genres.join(" • ")} • {selectedSeries.episodes} Episodes • {selectedSeries.subtitle}
              </div>
              <h2 className="mt-3 text-4xl font-semibold">{selectedSeries.title}</h2>
              <p className="mt-4 max-w-3xl text-base text-white/75">{selectedSeries.hook}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => goWatch(selectedSeries.id, 1)} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black">
                  Watch Episode 1
                </button>
                <button className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium">Add to Watchlist</button>
              </div>
              <div className="mt-3 text-sm text-white/45">First {selectedSeries.freeEpisodes} episodes free</div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-medium text-white/90">Synopsis</div>
                <p className="mt-3 text-sm leading-7 text-white/70">{selectedSeries.synopsis}</p>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="text-sm font-medium text-white/90">Why Watch</div>
                  <ul className="mt-3 space-y-3 text-sm text-white/70">
                    {selectedSeries.whyWatch.map((item) => (
                      <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="text-sm font-medium text-white/90">Creator / Studio</div>
                  <p className="mt-3 text-sm text-white/70">Submitted by {selectedSeries.creator}</p>
                  <button onClick={() => setPage("submit")} className="mt-4 rounded-2xl border border-white/15 px-4 py-2 text-sm">
                    Submit Your Series
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-sm font-medium text-white/90">Episodes</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {selectedSeries.episodeNames.map((ep, i) => (
                    <button
                      key={ep}
                      onClick={() => goWatch(selectedSeries.id, i + 1)}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm"
                    >
                      <span>Episode {i + 1} — {ep}</span>
                      <span className="text-white/50">Watch</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-medium text-white/90">Main Characters</div>
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  {selectedSeries.characters.map(([name, desc]) => (
                    <div key={name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="font-medium">{name}</div>
                      <div className="mt-2 text-sm text-white/65">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {page === "watch" && (
          <section>
            <button onClick={() => setPage("detail")} className="mb-5 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to Series
            </button>
            <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="aspect-[9/16] max-h-[760px] w-full rounded-3xl border border-white/10 bg-gradient-to-b from-black to-neutral-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="mx-auto h-16 w-16 text-white/80" />
                    <div className="mt-4 text-lg font-medium">Episode {selectedEpisode}</div>
                    <div className="mt-1 text-sm text-white/55">{selectedSeries.title}</div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold">Episode {selectedEpisode} — {selectedSeries.episodeNames[(selectedEpisode - 1) % selectedSeries.episodeNames.length]}</div>
                    <div className="mt-1 text-sm text-white/55">Series: {selectedSeries.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedEpisode(Math.max(1, selectedEpisode - 1))}
                      className="rounded-2xl border border-white/15 px-4 py-2 text-sm"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedEpisode(Math.min(selectedSeries.episodes, selectedEpisode + 1))}
                      className="rounded-2xl border border-white/15 px-4 py-2 text-sm"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {selectedEpisode > selectedSeries.freeEpisodes && (
                  <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
                    <div className="text-lg font-semibold">Continue Watching</div>
                    <p className="mt-2 text-sm text-white/70">
                      Create an account to continue this series and unlock more curated AI dramas.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black">Sign Up</button>
                      <button className="rounded-2xl border border-white/15 px-4 py-2 text-sm">Log In</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-medium text-white/90">Episode List</div>
                  <div className="mt-4 space-y-2">
                    {Array.from({ length: Math.min(selectedSeries.episodes, 10) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedEpisode(i + 1)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm ${selectedEpisode === i + 1 ? "border-white/30 bg-white/10" : "border-white/10 bg-black/20"}`}
                      >
                        <span>Episode {i + 1}</span>
                        {i + 1 <= selectedSeries.freeEpisodes ? <span className="text-emerald-300">Free</span> : <span className="text-white/45">Locked</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-medium text-white/90">More Like This</div>
                  <div className="mt-4 space-y-3">
                    {seriesData.filter((s) => s.id !== selectedSeries.id).slice(0, 3).map((item) => (
                      <button key={item.id} onClick={() => openSeries(item.id)} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left">
                        <div className={`h-20 w-14 rounded-xl bg-gradient-to-b ${item.color}`} />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="mt-1 text-xs text-white/50">{item.genres.join(" • ")}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {page === "submit" && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="max-w-3xl">
              <div className="inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">Creator Submission</div>
              <h2 className="mt-4 text-3xl font-semibold">Submit Your AI Short Drama</h2>
              <p className="mt-3 text-white/70">
                Send us your finished series for review, publishing, and optional promotion support on AIShortHub.
              </p>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                {[
                  ["What you can submit", "We accept completed AI short dramas, serialized story content, trailers, and teaser materials intended for short-form video audiences."],
                  ["What we review", "Our team reviews each submission for story clarity, visual consistency, technical format, and overall fit for the AIShortHub platform."],
                  ["Optional support", "Selected creators may request help with listing setup, title refinement, cover positioning, and promotional distribution support."],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="font-medium">{title}</div>
                    <div className="mt-2 text-sm text-white/65">{desc}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="grid gap-3">
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
                    <div key={field}>
                      <label className="mb-2 block text-sm text-white/80">{field}</label>
                      <div className="h-11 rounded-2xl border border-white/10 bg-white/5" />
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-3 text-sm text-white/70">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I confirm that I own or control the rights necessary to submit this content.</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I confirm that the submitted materials do not knowingly infringe third-party rights.</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I agree to the AIShortHub review and publishing policy.</span>
                  </label>
                </div>
                <button className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black">Submit for Review</button>
              </div>
            </div>
          </section>
        )}

        {page === "creator" && (
          <section>
            <SectionTitle title="Creator Dashboard" desc="Manage your submitted series and track review and publishing progress." />
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Total Views", "18.4K", Film],
                ["Series Published", "1", CheckCircle2],
                ["Review Pending", "1", Clock3],
                ["Promotion Active", "1", Star],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Icon className="h-5 w-5 text-white/70" />
                  <div className="mt-4 text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-sm text-white/55">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Your Series</div>
                <button onClick={() => setPage("submit")} className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black">Submit New Series</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-white/45">
                    <tr className="border-b border-white/10">
                      <th className="pb-3 font-medium">Series Title</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Episodes</th>
                      <th className="pb-3 font-medium">Submitted Date</th>
                      <th className="pb-3 font-medium">Promotion Status</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creatorRows.map((row) => (
                      <tr key={row.title} className="border-b border-white/5">
                        <td className="py-4 font-medium">{row.title}</td>
                        <td className="py-4"><span className={`rounded-full px-3 py-1 text-xs ${statusBadge(row.status)}`}>{row.status}</span></td>
                        <td className="py-4 text-white/70">{row.episodes}</td>
                        <td className="py-4 text-white/70">{row.date}</td>
                        <td className="py-4 text-white/70">{row.promo}</td>
                        <td className="py-4"><button className="rounded-2xl border border-white/15 px-3 py-2 text-xs">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-lg font-semibold">Service History</div>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Listing Setup — Completed</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Cover Optimization — In Progress</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Promotion Support — Active</div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-lg font-semibold">Quick Actions</div>
                <div className="mt-4 space-y-3">
                  {[
                    ["Submit New Series", Upload],
                    ["Request Promotion", Star],
                    ["Contact Support", User],
                  ].map(([label, Icon]) => (
                    <button key={label} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left text-sm">
                      <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>
                      <ChevronRight className="h-4 w-4 text-white/45" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {page === "pricing" && (
          <section>
            <SectionTitle title="Creator Services" desc="Choose the level of publishing and promotion support that fits your series." />
            <div className="grid gap-5 md:grid-cols-3">
              {pricing.map((plan, idx) => (
                <div key={plan.name} className={`rounded-3xl border p-6 ${idx === 1 ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5"}`}>
                  <div className="text-lg font-semibold">{plan.name}</div>
                  <div className="mt-3 text-3xl font-semibold">{plan.price}</div>
                  <div className="mt-5 space-y-3 text-sm text-white/70">
                    {plan.items.map((item) => (
                      <div key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />{item}</div>
                    ))}
                  </div>
                  <button className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${idx === 1 ? "bg-white text-black" : "border border-white/15"}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "admin" && (
          <section>
            <SectionTitle title="Admin" desc="Internal moderation and content operations panel." />
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Total Series", "12", Film],
                ["Pending Review", "3", Clock3],
                ["Published", "7", CheckCircle2],
                ["Needs Attention", "2", AlertCircle],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Icon className="h-5 w-5 text-white/70" />
                  <div className="mt-4 text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-sm text-white/55">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Review Queue</div>
                <button className="rounded-2xl border border-white/15 px-4 py-2 text-sm">Homepage Picks</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="text-white/45">
                    <tr className="border-b border-white/10">
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Creator</th>
                      <th className="pb-3 font-medium">Episodes</th>
                      <th className="pb-3 font-medium">Suggested Action</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminRows.map((row) => (
                      <tr key={row.title} className="border-b border-white/5">
                        <td className="py-4 font-medium">{row.title}</td>
                        <td className="py-4 text-white/70">{row.creator}</td>
                        <td className="py-4 text-white/70">{row.episodes}</td>
                        <td className="py-4 text-white/70">{row.action}</td>
                        <td className="py-4"><button className="rounded-2xl bg-white px-3 py-2 text-xs font-medium text-black">Open</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-4">
          <div>
            <div className="text-lg font-semibold">AIShortHub</div>
            <p className="mt-3 text-sm text-white/55">Curated AI short dramas for viewers and creators.</p>
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">Platform</div>
            <div className="mt-3 space-y-2 text-sm text-white/55">
              <div>Browse</div>
              <div>Submit</div>
              <div>Creator Services</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">Legal</div>
            <div className="mt-3 space-y-2 text-sm text-white/55">
              <div>Terms of Use</div>
              <div>Privacy Policy</div>
              <div>Copyright Policy</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">Internal Demo</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setPage("creator")} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">Creator</button>
              <button onClick={() => setPage("admin")} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">Admin</button>
              <button onClick={() => setPage("pricing")} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">Pricing</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
