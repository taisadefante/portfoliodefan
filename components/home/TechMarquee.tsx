import { techItems } from "./data";

export default function TechMarquee() {
  return (
    <section className="tech-strip" aria-label="Tecnologias e soluções">
      <style jsx>{`
        .tech-strip {
          overflow: hidden;
        }

        .tech-row {
          display: flex;
          align-items: center;
          gap: 18px;
          width: max-content;
          animation: marquee 22s linear infinite;
        }

        .tech-row span {
          flex: 0 0 auto;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .tech-row {
            animation-duration: 11s;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .tech-row {
            animation-duration: 8s;
          }
        }
      `}</style>

      <div className="container tech-row">
        {[...techItems, ...techItems].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}
