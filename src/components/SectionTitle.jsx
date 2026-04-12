export default function SectionTitle({ title, desc }) {
  return (
    <div className="section-title-wrap">
      <h2>{title}</h2>
      {desc ? <p>{desc}</p> : null}
    </div>
  );
}
