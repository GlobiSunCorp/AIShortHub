import { SUPPORT_CONTACT_CONFIG } from '../data/monetization';
import { GlossaryCatalog } from '../components/GlossaryCatalog';
import { HowPricingWorksPanel } from '../components/billing/HowPricingWorksPanel';

const FAQ_GROUPS = [
  {
    title: 'Platform basics',
    items: [
      {
        q: 'What is AIShortHub?',
        a: 'AIShortHub is an AI-powered short video discovery and creator showcase platform for cinematic AI shorts, vertical videos, trailers, music videos, animations, commercials, product videos, and experimental stories.',
      },
      {
        q: 'Is this only for AI short dramas?',
        a: 'No. Drama can live here, but the broader direction is AI-powered short videos: narrative shorts, music videos, trailers, animation, product videos, commercial work, and experimental creator projects.',
      },
      {
        q: 'What does “AI shorts” mean here?',
        a: 'AI shorts means short-form video projects where AI tools are meaningfully involved in image, video, audio, editing, animation, concept, or production workflow.',
      },
    ],
  },
  {
    title: 'For viewers',
    items: [
      {
        q: 'How does subscription work?',
        a: 'Free includes trailer / teaser / preview videos only. Pro Viewer unlocks broader AI short video access. Premium Viewer adds higher quality, early access, and exclusive AI shorts.',
      },
      {
        q: 'Can viewers buy without subscribing?',
        a: 'Yes. Creators can configure single-title or single-video unlocks where appropriate, so viewers can buy only what they want to watch.',
      },
      {
        q: 'What is always free to sample?',
        a: 'The intended flow is trailer / teaser first, then preview videos when available. Main videos may require subscription or unlock depending on creator settings.',
      },
    ],
  },
  {
    title: 'For creators',
    items: [
      {
        q: 'What can creators submit?',
        a: 'Creators can submit AI short projects with clear metadata, poster or cover, trailer / teaser, at least one main video, category, tags, and rights / safety notes.',
      },
      {
        q: 'What does a good project package include?',
        a: 'A strong package includes a static poster, vertical cover or square thumbnail, trailer / teaser, main video, synopsis, category, tags, audience setting, and review notes explaining rights and AI workflow.',
      },
      {
        q: 'How long does review take?',
        a: 'Draft projects move to pending_review, then approved/published or rejected. Pilot operations usually target 24-72 hours, depending on content complexity and safety review needs.',
      },
      {
        q: 'How do creator services work?',
        a: 'Creators can submit service orders in Services. Included, Discounted, Add-on, or Optional entitlement depends on the current creator plan.',
      },
    ],
  },
  {
    title: 'Billing and monetization',
    items: [
      {
        q: 'How is commission calculated?',
        a: 'Creator-friendly launch commission is 8% / 5% / 3% by Creator Basic / Creator Pro / Studio, and only applies after creator-generated revenue exists.',
      },
      {
        q: 'Is creator plan monthly fee the same as commission?',
        a: 'No. Monthly fee covers tools, quota, review priority, storage, and support. Platform commission only applies after real creator revenue exists.',
      },
      {
        q: 'What are the platform revenue sources?',
        a: 'The launch model prioritizes advertising, creator services, viewer subscriptions, single-title / single-video unlocks, and only then low platform commission.',
      },
    ],
  },
  {
    title: 'Content policy and rights',
    items: [
      {
        q: 'What content may be rejected?',
        a: 'Content may be rejected for IP infringement, misleading AI claims, unsafe commercial claims, excessive gore, hate, sexual exploitation, illegal promotion, or missing rights information.',
      },
      {
        q: 'Can commercial or product videos be submitted?',
        a: 'Yes, but commercial and product-video submissions should be clearly labeled and must not mislead viewers about sponsorship, product claims, or ownership.',
      },
      {
        q: 'Do creators need music and likeness rights?',
        a: 'Yes. Creators should confirm rights to music, voice, likeness, brand, footage, and other third-party assets where applicable.',
      },
    ],
  },
];

export function FAQPage() {
  const viewerSummary = {
    unlocks: 'member catalog access by plan tier, plus trailer / teaser / preview videos for sampling',
    stillPaid: 'Some titles can stay title-priced or single-video priced based on creator settings.',
  };
  const creatorSummary = {
    monthlyFeeCovers: 'Creator monthly fee covers upload/storage/review tooling, quota, creator workflow, and operational support.',
    commissionRule: 'Platform commission applies only after real creator revenue exists.',
  };

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <p className="kicker">Help Center</p>
        <h1>FAQ</h1>
        <p className="small-text">Clear answers for viewers, creators, billing, content policy, and AI shorts platform operations.</p>
      </section>

      <section className="grid cards-2">
        {FAQ_GROUPS.map((group) => (
          <article key={group.title} className="panel stack-md">
            <h2 className="ds-h2">{group.title}</h2>
            {group.items.map((item) => (
              <div key={item.q} className="mini-card" style={{ borderRadius: '22px' }}>
                <h3 className="ds-h3">{item.q}</h3>
                <p className="ds-meta">{item.a}</p>
              </div>
            ))}
          </article>
        ))}
      </section>

      <HowPricingWorksPanel viewerSummary={viewerSummary} creatorSummary={creatorSummary} />

      <section className="panel stack-md">
        <h3>Contact routing</h3>
        <p className="small-text">Support: {SUPPORT_CONTACT_CONFIG.supportEmail} · Creator Ops: {SUPPORT_CONTACT_CONFIG.creatorOpsEmail} · Policy/Abuse: {SUPPORT_CONTACT_CONFIG.policyEmail}.</p>
      </section>

      <section className="panel stack-md">
        <h3>Glossary by category</h3>
        <p className="small-text">Hover on desktop or tap the info icon on mobile to see plain-English explanations.</p>
        <GlossaryCatalog />
      </section>
    </div>
  );
}
