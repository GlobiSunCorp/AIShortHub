export function PricingCard({ plan }) {
  return (
    <article className="pricing-card">
      <h3>{plan.name}</h3>
      <div className="price">{plan.price}</div>
      <p>{plan.note}</p>
      <ul>
        {plan.features.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button className="btn btn-primary">Select</button>
    </article>
  );
}
