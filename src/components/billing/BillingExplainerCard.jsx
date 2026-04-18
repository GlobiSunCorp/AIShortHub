import { GlossaryTerm } from '../GlossaryTerm';

export function BillingExplainerCard({ title, bullets = [], footer }) {
  return (
    <article className="mini-card">
      <h4>{title}</h4>
      <ul>
        {bullets.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {footer ? <p className="small-text">{footer} <GlossaryTerm id="platform_commission" compact /></p> : null}
    </article>
  );
}
