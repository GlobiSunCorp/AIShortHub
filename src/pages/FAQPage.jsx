import { SUPPORT_CONTACT_CONFIG } from '../data/monetization';

export function FAQPage() {
  return (
    <section className="panel stack-md">
      <h1>FAQ</h1>
      <p><strong>How does subscription work?</strong> Free includes trailer/preview only; Pro Viewer ($4.99) unlocks full content; Premium Viewer ($9.99) adds higher quality and early access.</p>
      <p><strong>How do creator services work?</strong> Submit service orders in Services. Included/Discounted/Add-on entitlement depends on your creator plan.</p>
      <p><strong>How is commission calculated?</strong> Platform default is configurable at 20%, while creator plans reduce commission to 15% / 10% / 7% and expand quota + tools.</p>
      <p><strong>How long does review take?</strong> Draft → pending_review → approved/published or rejected, usually within 24-72 hours in pilot ops.</p>
      <p><strong>Where to contact?</strong> Support: {SUPPORT_CONTACT_CONFIG.supportEmail} · Creator Ops: {SUPPORT_CONTACT_CONFIG.creatorOpsEmail} · Policy/Abuse: {SUPPORT_CONTACT_CONFIG.policyEmail}.</p>
    </section>
  );
}
