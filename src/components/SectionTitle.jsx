export function SectionTitle({ title, desc, action, eyebrow }) {
  return (
    <div className="section-title">
      <div>
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        <h2 className="ds-h2">{title}</h2>
        {desc ? <p className="ds-meta">{desc}</p> : null}
      </div>
      {action}
    </div>
  );
}
