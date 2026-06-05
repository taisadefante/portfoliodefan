import { proofItems } from "./data";

export default function SocialProof() {
  return (
    <section className="proof-section">
      <div className="container proof-grid">
        {proofItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="proof-card" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="proof-icon"><Icon size={24} /></div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <p>{item.small}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
