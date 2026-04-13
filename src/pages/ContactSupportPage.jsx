import { SUPPORT_CONTACT_CONFIG } from '../data/monetization';

export function ContactSupportPage() {
  const isPilot = SUPPORT_CONTACT_CONFIG.mode === 'pilot';
  return (
    <section className="panel stack-md">
      <h1>Contact / Support</h1>
      <p className="small-text">Support hours: Mon-Fri 09:00-18:00 UTC.</p>
      {isPilot ? <p className="form-feedback">{SUPPORT_CONTACT_CONFIG.pilotNotice}</p> : <p className="form-feedback success">Custom domain support inbox routing is active.</p>}
      <div className="grid cards-3">
        <article className="mini-card"><h3>Support</h3><p className="small-text">订阅/支付/账号问题</p><p>{SUPPORT_CONTACT_CONFIG.supportEmail}</p></article>
        <article className="mini-card"><h3>Creator Ops</h3><p className="small-text">上传、审核、排期、结算</p><p>{SUPPORT_CONTACT_CONFIG.creatorOpsEmail}</p></article>
        <article className="mini-card"><h3>Policy / Abuse</h3><p className="small-text">侵权、举报、政策申诉</p><p>{SUPPORT_CONTACT_CONFIG.policyEmail}</p></article>
      </div>
      {isPilot ? <p className="small-text">Fallback contact mode: use the above emails and include account email + order/series ID + screenshots. Optional form route: {SUPPORT_CONTACT_CONFIG.fallbackFormUrl}.</p> : null}
    </section>
  );
}
