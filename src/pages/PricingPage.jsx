import { CheckCircle2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { pricing } from "../data/pricing";

export default function PricingPage() {
  return (
    <section className="section-block">
      <SectionTitle
        title="Creator Services"
        desc="Choose the level of publishing and promotion support that fits your series."
      />
      <div className="card-grid three">
        {pricing.map((plan, index) => (
          <div key={plan.name} className={index === 1 ? "price-card featured" : "price-card"}>
            <h3>{plan.name}</h3>
            <div className="price-value">{plan.price}</div>
            <div className="stack-col">
              {plan.items.map((item) => (
                <div key={item} className="price-item">
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button className={index === 1 ? "btn btn-light top-gap" : "btn btn-outline top-gap"}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
