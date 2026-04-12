export const seriesData = [
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

export const getSeriesById = (id) => seriesData.find((series) => series.id === id) ?? seriesData[0];
