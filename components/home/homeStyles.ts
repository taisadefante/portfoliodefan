export const homeAnimations = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes floatSoft { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes shineMove { to { background-position: 220% center; } }
  .animate-fade-up { opacity: 0; animation: fadeUp .8s ease forwards; }
  .delay-2 { animation-delay: .24s; }
  .delay-3 { animation-delay: .36s; }
  .hero-visual { animation: scaleIn .9s ease forwards, floatSoft 6.5s ease-in-out 1.1s infinite; }
  .shine-text { background-size: 220% auto !important; animation: shineMove 6.5s linear infinite; }
  .home-service-card, .home-value-card, .home-faq-card, .home-testimonial-card, .proof-card { opacity: 0; animation: fadeUp .8s ease forwards; }
  .home-project-card { opacity: 0; animation: scaleIn .8s ease forwards; transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease; }
  .home-project-card:hover { transform: translateY(-8px); border-color: rgba(250, 204, 21, .42) !important; box-shadow: 0 36px 96px rgba(14, 165, 233, .18), 0 0 0 1px rgba(250,204,21,.14) !important; }
  .home-project-card:hover img { transform: scale(1.055) !important; transition: transform .35s ease; }
  .premium-link { transition: color .2s ease, transform .2s ease; }
  .premium-link:hover { color: #fef3c7 !important; transform: translateY(-1px); }
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-up, .hero-visual, .home-service-card, .home-value-card, .home-faq-card, .home-testimonial-card, .home-project-card, .proof-card, .shine-text { animation: none !important; opacity: 1 !important; transform: none !important; }
  }
`;
