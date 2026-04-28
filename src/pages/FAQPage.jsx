import { SUPPORT_CONTACT_CONFIG } from '../data/monetization';
import { GlossaryCatalog } from '../components/GlossaryCatalog';
import { HowPricingWorksPanel } from '../components/billing/HowPricingWorksPanel';

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
        <h1>FAQ</h1>
        <p><strong>What is AIShortHub?</strong> AIShortHub is an AI-powered short video discovery and creator showcase platform for cinematic AI shorts, vertical videos, trailers, music videos, animations, commercials, product videos, and experimental stories.</p>
        <p><strong>How does subscription work?</strong> Free includes trailer / teaser / preview videos only; Pro Viewer ($4.99) unlocks broader AI short video access; Premium Viewer ($9.99) adds higher quality, early access, and exclusive AI shorts.</p>
        <p><strong>Can viewers buy without subscribing?</strong> Yes. Creators can configure single-title or single-video unlocks where appropriate.</p>
        <p><strong>How do creator services work?</strong> Submit service orders in Services. Included / Discounted / Add-on entitlement depends on your creator plan.</p>
        <p><strong>How is commission calculated?</strong> Creator-friendly launch commission is 8% / 5% / 3% by Creator Basic / Creator Pro / Studio, and only applies after creator-generated revenue exists.</p>
        <p><strong>How long does review take?</strong> Draft → pending_review → approved/published or rejected, usually within 24-72 hours in pilot ops.</p>
        <p><strong>What can creators submit?</strong> AI short projects should include clear metadata, poster or cover, trailer / teaser, at least one main video, category, tags, and rights / safety notes.</p>
        <p><strong>Where to contact?</strong> Support: {SUPPORT_CONTACT_CONFIG.supportEmail} · Creator Ops: {SUPPORT_CONTACT_CONFIG.creatorOpsEmail} · Policy/Abuse: {SUPPORT_CONTACT_CONFIG.policyEmail}.</p>
      </section>
      <HowPricingWorksPanel viewerSummary={viewerSummary} creatorSummary={creatorSummary} />
      <section className="panel stack-md">
        <h3>Glossary by category</h3>
        <p className="small-text">Hover on desktop or tap the info icon on mobile to see plain-English explanations.</p>
        <GlossaryCatalog />
      </section>
    </div>
  );
}
