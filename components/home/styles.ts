export const styles = `
:root {
  --bg: #020617;
  --bg2: #06142f;
  --panel: rgba(7, 20, 48, .74);
  --panel2: rgba(11, 35, 76, .64);
  --line: rgba(96, 165, 250, .28);
  --line2: rgba(56, 189, 248, .42);
  --text: #f8fafc;
  --muted: #b7c7df;
  --soft: #7d91b3;
  --blue: #38bdf8;
  --blue2: #2563eb;
  --blue3: #60a5fa;
  --shadow: 0 30px 100px rgba(2, 8, 23, .65);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--bg); }
a { color: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }

.premium-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  background:
    radial-gradient(circle at 16% 3%, rgba(37, 99, 235, .34), transparent 34%),
    radial-gradient(circle at 74% 8%, rgba(14, 165, 233, .24), transparent 32%),
    radial-gradient(circle at 50% 35%, rgba(59, 130, 246, .12), transparent 40%),
    linear-gradient(180deg, #020617 0%, #06142f 38%, #020617 100%);
}

.page-glow {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(90px);
  opacity: .58;
  animation: glowMove 12s ease-in-out infinite alternate;
}
.page-glow-1 { width: 560px; height: 560px; top: -220px; left: -180px; background: rgba(37, 99, 235, .34); }
.page-glow-2 { width: 620px; height: 620px; top: 260px; right: -260px; background: rgba(14, 165, 233, .24); animation-delay: -5s; }

.container { width: min(1480px, calc(100% - 96px)); margin: 0 auto; position: relative; z-index: 2; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 80;
  background: rgba(2, 6, 23, .74);
  border-bottom: 1px solid rgba(96, 165, 250, .18);
  backdrop-filter: blur(24px);
}
.header-inner { min-height: 82px; display: flex; align-items: center; justify-content: space-between; gap: 22px; }
.brand img { width: auto; height: 60px; object-fit: contain; filter: drop-shadow(0 0 22px rgba(96, 165, 250, .34)); }
.nav-menu { display: flex; gap: 30px; align-items: center; font-size: 14px; font-weight: 800; color: #eaf4ff; }
.nav-menu a { text-decoration: none; opacity: .86; transition: .25s ease; }
.nav-menu a:hover { opacity: 1; color: var(--blue); transform: translateY(-1px); }

.btn {
  border: 1px solid rgba(96, 165, 250, .24);
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 50px;
  padding: 0 24px;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background .25s ease;
}
.btn:hover { transform: translateY(-3px); }
.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 38%, #38bdf8 100%);
  border-color: rgba(125, 211, 252, .55);
  box-shadow: 0 22px 58px rgba(37, 99, 235, .42), inset 0 1px 0 rgba(255,255,255,.35);
}
.btn-primary:hover { box-shadow: 0 32px 80px rgba(14, 165, 233, .48), inset 0 1px 0 rgba(255,255,255,.45); }
.btn-ghost {
  color: #eaf4ff;
  background: rgba(7, 20, 48, .5);
  border-color: rgba(96, 165, 250, .42);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
}
.btn-ghost:hover { border-color: rgba(56, 189, 248, .8); background: rgba(15, 48, 106, .55); }

.hero-section { padding: 84px 0 42px; }
.hero-grid { display: grid; grid-template-columns: minmax(0, .92fr) minmax(520px, 1.08fr); gap: 70px; align-items: center; }
.hero-copy { max-width: 690px; }
.hero-pill, .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.hero-pill {
  padding: 10px 15px;
  border-radius: 999px;
  background: rgba(37, 99, 235, .18);
  border: 1px solid rgba(96, 165, 250, .34);
  box-shadow: 0 0 0 6px rgba(37, 99, 235, .07);
  text-transform: none;
  letter-spacing: 0;
}
.hero-copy h1 {
  margin: 28px 0 0;
  font-size: clamp(48px, 5.5vw, 92px);
  line-height: .93;
  letter-spacing: -.075em;
  text-wrap: balance;
}
.hero-copy h1 strong {
  background: linear-gradient(135deg, #60a5fa, #38bdf8, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 24px rgba(56, 189, 248, .3));
}
.hero-copy p { margin: 30px 0 0; color: var(--muted); font-size: 19px; line-height: 1.78; max-width: 660px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 34px; }
.hero-checks { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 42px; color: #e5f3ff; font-size: 14px; font-weight: 800; }
.hero-checks span { display: inline-flex; align-items: center; gap: 9px; }
.hero-checks svg { color: var(--blue); }

.hero-mockup { position: relative; min-height: 580px; animation: floatCard 7s ease-in-out infinite; }
.mockup-orb { position: absolute; border-radius: 999px; filter: blur(42px); pointer-events: none; }
.mockup-orb-1 { width: 280px; height: 280px; top: -40px; right: 40px; background: rgba(37, 99, 235, .36); }
.mockup-orb-2 { width: 280px; height: 280px; bottom: 20px; left: 0; background: rgba(14, 165, 233, .18); }
.dashboard-card {
  position: relative;
  min-height: 450px;
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 20px;
  padding: 24px;
  border-radius: 34px;
  background: linear-gradient(145deg, rgba(7, 20, 48, .82), rgba(5, 18, 44, .96));
  border: 1px solid rgba(96, 165, 250, .58);
  box-shadow: 0 45px 130px rgba(0,0,0,.56), 0 0 90px rgba(37, 99, 235, .24), inset 0 1px 0 rgba(255,255,255,.12);
  overflow: hidden;
}
.dashboard-card:before {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(110deg, transparent, rgba(96, 165, 250, .26), transparent);
  transform: translateX(-100%);
  animation: shine 5s ease-in-out infinite;
}
.dashboard-sidebar, .dashboard-main { position: relative; z-index: 2; }
.dashboard-sidebar { padding: 18px 12px; border-radius: 24px; background: rgba(2, 6, 23, .42); border: 1px solid rgba(96, 165, 250, .15); display: flex; flex-direction: column; gap: 10px; }
.dashboard-sidebar img { width: 92px; height: auto; margin-bottom: 8px; }
.dashboard-sidebar span { padding: 12px; border-radius: 14px; color: #a9bdd8; font-size: 13px; font-weight: 800; }
.dashboard-sidebar span.active { background: linear-gradient(135deg, rgba(37,99,235,.85), rgba(14,165,233,.38)); color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.14); }
.dashboard-main { min-width: 0; }
.dashboard-top { display: flex; justify-content: space-between; align-items: center; gap: 18px; color: #bcd4f2; font-size: 13px; }
.search { width: min(280px, 60%); height: 38px; border-radius: 999px; background: rgba(2,6,23,.45); border: 1px solid rgba(96,165,250,.18); display: flex; align-items: center; gap: 8px; padding: 0 14px; color: #7390b4; }
.dashboard-main h3 { margin: 24px 0 16px; font-size: 22px; }
.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.stat-box, .chart-card, .activity-card { background: rgba(7, 20, 48, .72); border: 1px solid rgba(96,165,250,.16); border-radius: 18px; padding: 16px; }
.stat-box small { display: block; color: #7e9abd; font-size: 12px; }
.stat-box strong { display: block; margin-top: 7px; font-size: 21px; }
.stat-box em { display: block; margin-top: 8px; color: #22c55e; font-style: normal; font-weight: 900; font-size: 12px; }
.chart-card { margin-top: 14px; height: 150px; }
.chart-title { color: #bcd4f2; font-weight: 900; font-size: 13px; margin-bottom: 16px; }
.bars { height: 88px; display: flex; align-items: end; gap: 10px; }
.bars span { flex: 1; border-radius: 999px 999px 4px 4px; background: linear-gradient(180deg, #60a5fa, #2563eb); box-shadow: 0 0 26px rgba(59,130,246,.3); animation: barGrow 2.2s ease both; }
.activity-card { margin-top: 14px; display: grid; gap: 9px; color: #9fb4d2; }
.activity-card strong { color: #fff; }
.phone-card { position: absolute; right: -35px; bottom: 92px; width: 190px; height: 250px; border-radius: 30px; padding: 24px; background: rgba(5, 18, 44, .9); border: 1px solid rgba(96, 165, 250, .58); box-shadow: 0 30px 90px rgba(0,0,0,.55); z-index: 4; }
.phone-card strong { display: block; font-size: 24px; margin-top: 50px; }
.phone-card span { color: #92a9c9; }
.phone-line, .phone-line-2 { height: 46px; margin-top: 26px; border-radius: 20px; background: linear-gradient(135deg, transparent 15%, rgba(56,189,248,.9)); clip-path: polygon(0 72%, 20% 48%, 42% 60%, 65% 20%, 100% 35%, 100% 100%, 0 100%); opacity: .75; }
.phone-line-2 { height: 24px; margin-top: 12px; opacity: .36; }
.floating-badge { position: absolute; right: 70px; bottom: 50px; z-index: 5; display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-radius: 22px; color: #eaf4ff; font-weight: 900; background: rgba(7,20,48,.86); border: 1px solid rgba(96,165,250,.38); box-shadow: 0 24px 80px rgba(0,0,0,.38); backdrop-filter: blur(18px); animation: pulseBadge 3s ease-in-out infinite; }
.floating-badge svg { color: var(--blue); }

.tech-strip { padding: 12px 0 14px; overflow: hidden; }
.tech-row { display: flex; gap: 12px; white-space: nowrap; animation: marquee 28s linear infinite; }
.tech-row span, .tag-row span { display: inline-flex; align-items: center; border-radius: 999px; color: #dbeafe; font-weight: 900; background: rgba(7, 20, 48, .72); border: 1px solid rgba(96, 165, 250, .28); box-shadow: inset 0 1px 0 rgba(255,255,255,.07); }
.tech-row span { padding: 12px 18px; }

.proof-section { padding: 24px 0 26px; }
.proof-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-radius: 30px; overflow: hidden; border: 1px solid rgba(96, 165, 250, .35); background: linear-gradient(135deg, rgba(37,99,235,.28), rgba(7,20,48,.82), rgba(14,165,233,.22)); box-shadow: 0 28px 90px rgba(37,99,235,.22), inset 0 1px 0 rgba(255,255,255,.12); }
.proof-card { padding: 28px; border-right: 1px solid rgba(96,165,250,.2); animation: revealUp .8s ease both; }
.proof-card:last-child { border-right: 0; }
.proof-icon { width: 48px; height: 48px; border-radius: 16px; display: grid; place-items: center; color: #bfdbfe; background: rgba(37, 99, 235, .28); border: 1px solid rgba(96,165,250,.24); }
.proof-card strong { display: block; margin-top: 12px; font-size: clamp(30px, 3vw, 48px); line-height: 1; background: linear-gradient(135deg, #dbeafe, #60a5fa, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.proof-card span { display: block; margin-top: 8px; font-weight: 950; }
.proof-card p { margin: 5px 0 0; color: #a9bdd8; line-height: 1.45; }

.section-block { padding: 105px 0; position: relative; }
.section-title { max-width: 840px; margin: 0 auto 48px; }
.section-title-center { text-align: center; }
.section-title-left { text-align: left; margin-left: 0; }
.section-title h2, .section-head-row h2, .testimonial-title h2, .faq-head h2, .final-cta-card h2 { margin: 12px 0 0; font-size: clamp(35px, 4vw, 58px); line-height: 1.02; letter-spacing: -.06em; text-wrap: balance; }
.section-title p, .section-head-row p, .final-cta-card p { color: var(--muted); line-height: 1.7; font-size: 18px; }

.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.service-card, .value-card, .testimonial-card, .faq-item, .glass-card, .modal-summary, .modal-detail-box {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(7, 20, 48, .82), rgba(5, 18, 44, .72));
  border: 1px solid rgba(96, 165, 250, .22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 28px 80px rgba(0,0,0,.22);
  backdrop-filter: blur(20px);
}
.service-card { min-height: 170px; border-radius: 26px; padding: 28px; display: grid; grid-template-columns: auto 1fr auto; gap: 22px; animation: revealUp .8s ease both; transition: .35s ease; }
.service-card:hover, .project-card:hover, .value-card:hover, .testimonial-card:hover { transform: translateY(-8px); border-color: rgba(56,189,248,.7); box-shadow: 0 30px 110px rgba(37, 99, 235, .24); }
.service-icon { width: 64px; height: 64px; border-radius: 22px; display: grid; place-items: center; color: #7dd3fc; background: linear-gradient(135deg, rgba(37,99,235,.42), rgba(14,165,233,.16)); border: 1px solid rgba(96,165,250,.25); box-shadow: 0 0 36px rgba(14,165,233,.15); }
.service-card h3, .value-card h3, .testimonial-card strong { margin: 0 0 10px; font-size: 22px; }
.service-card p, .value-card p, .testimonial-card p, .faq-item p, .glass-card p, .modal-summary p { margin: 0; color: var(--muted); line-height: 1.65; }
.card-arrow { color: var(--blue); font-size: 24px; }

.about-section { background: linear-gradient(180deg, transparent, rgba(7,20,48,.28), transparent); }
.about-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 24px; }
.glass-card { border-radius: 30px; padding: 42px; }
.about-main h2 { margin: 18px 0; font-size: clamp(34px, 4vw, 58px); line-height: 1; letter-spacing: -.06em; }
.founder-card img { width: 220px; height: auto; margin-bottom: 28px; }
.founder-card h3 { margin: 14px 0 14px; font-size: 36px; letter-spacing: -.05em; }
.values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 24px; }
.value-card { border-radius: 24px; padding: 28px; animation: revealUp .8s ease both; }
.value-card svg { color: var(--blue); margin-bottom: 22px; }

.projects-section { padding-top: 96px; }
.section-head-row { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 30px; }
.section-head-row > div { max-width: 760px; }
.project-shell { position: relative; }
.projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.project-card { min-height: 470px; border-radius: 30px; overflow: hidden; cursor: pointer; background: linear-gradient(145deg, rgba(7,20,48,.86), rgba(5,18,44,.76)); border: 1px solid rgba(96,165,250,.34); box-shadow: 0 28px 90px rgba(0,0,0,.26); animation: revealUp .8s ease both; transition: .35s ease; }
.project-image { height: 255px; position: relative; overflow: hidden; background: rgba(2,6,23,.5); }
.project-image img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; transition: transform .55s ease; }
.project-card:hover .project-image img { transform: scale(1.07); }
.project-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(2,6,23,0) 42%, rgba(2,6,23,.92)); }
.project-placeholder { width: 100%; height: 100%; display: grid; place-items: center; background: radial-gradient(circle at 50% 20%, rgba(56,189,248,.24), transparent 42%), rgba(2,6,23,.44); }
.project-content { padding: 24px; margin-top: -50px; position: relative; z-index: 2; }
.project-content h3 { margin: 0 0 10px; font-size: 26px; line-height: 1.1; letter-spacing: -.04em; }
.project-content p { margin: 0 0 18px; color: var(--muted); line-height: 1.55; min-height: 52px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-row span { padding: 8px 12px; font-size: 12px; }
.project-content button { width: 100%; margin-top: 22px; min-height: 46px; border-radius: 999px; color: #fff; font-weight: 900; border: 1px solid rgba(96,165,250,.42); background: linear-gradient(135deg, rgba(37,99,235,.72), rgba(14,165,233,.34)); display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
.slider-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 4; width: 54px; height: 54px; border-radius: 18px; border: 1px solid rgba(96,165,250,.38); background: rgba(7,20,48,.88); color: #dbeafe; display: grid; place-items: center; cursor: pointer; box-shadow: 0 20px 70px rgba(0,0,0,.4); }
.slider-left { left: -72px; }
.slider-right { right: -72px; }
.slider-dots { display: flex; justify-content: center; gap: 9px; margin-top: 28px; }
.slider-dots button { width: 10px; height: 10px; border: 0; border-radius: 999px; background: rgba(96,165,250,.28); cursor: pointer; transition: .25s; }
.slider-dots button.active { width: 30px; background: linear-gradient(135deg, #2563eb, #38bdf8); }

.testimonials-section { border-top: 1px solid rgba(96,165,250,.12); border-bottom: 1px solid rgba(96,165,250,.12); background: rgba(2, 6, 23, .22); }
.testimonial-layout { display: grid; grid-template-columns: .68fr 1.32fr; gap: 28px; align-items: center; }
.testimonial-title .btn { margin-top: 26px; }
.testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.testimonial-card { border-radius: 24px; padding: 28px; animation: revealUp .8s ease both; }
.stars { display: flex; gap: 4px; color: #60a5fa; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(96,165,250,.45)); }
.testimonial-card strong { display: block; margin-top: 22px; }
.testimonial-card span { color: #93c5fd; font-size: 14px; }

.faq-head { text-align: center; max-width: 760px; }
.faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 32px; }
.faq-item { border-radius: 18px; }
.faq-item summary { list-style: none; cursor: pointer; min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 22px; font-weight: 950; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item p { padding: 0 22px 22px; }
.faq-item[open] summary svg { transform: rotate(180deg); }
.faq-item svg { transition: .25s; color: var(--blue); }

.final-cta-section { padding: 80px 0 100px; }
.final-cta-card { border-radius: 34px; padding: 42px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 30px; overflow: hidden; background: radial-gradient(circle at 15% 50%, rgba(37,99,235,.36), transparent 28%), linear-gradient(135deg, rgba(37,99,235,.38), rgba(7,20,48,.82)); border: 1px solid rgba(96,165,250,.4); box-shadow: 0 28px 100px rgba(37,99,235,.22), inset 0 1px 0 rgba(255,255,255,.13); }
.telegram-icon { width: 92px; height: 92px; border-radius: 30px; display: grid; place-items: center; color: #dbeafe; background: linear-gradient(135deg, #1d4ed8, #38bdf8); box-shadow: 0 20px 70px rgba(37,99,235,.45); }
.final-cta-card h2 { max-width: 720px; }
.final-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: flex-end; }

.modal-backdrop { position: fixed; inset: 0; z-index: 200; padding: 20px; display: grid; place-items: center; background: rgba(2,6,23,.84); backdrop-filter: blur(18px); }
.project-modal { width: min(1180px, 100%); max-height: 92vh; overflow: auto; border-radius: 32px; background: radial-gradient(circle at 18% 0%, rgba(37,99,235,.28), transparent 34%), linear-gradient(145deg, rgba(7,20,48,.98), rgba(2,6,23,.96)); border: 1px solid rgba(96,165,250,.42); box-shadow: 0 45px 150px rgba(0,0,0,.7); }
.modal-header { position: sticky; top: 0; z-index: 2; display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; padding: 26px; background: rgba(2,6,23,.78); border-bottom: 1px solid rgba(96,165,250,.18); backdrop-filter: blur(18px); }
.modal-header h2 { margin: 14px 0 0; font-size: clamp(32px, 4vw, 58px); line-height: 1; letter-spacing: -.06em; }
.modal-header button, .gallery-nav { border: 1px solid rgba(96,165,250,.34); background: rgba(7,20,48,.74); color: #fff; border-radius: 16px; cursor: pointer; display: grid; place-items: center; }
.modal-header button { width: 46px; height: 46px; }
.modal-body { display: grid; grid-template-columns: 1.05fr .95fr; gap: 22px; padding: 26px; }
.modal-main-image { position: relative; min-height: 420px; border-radius: 26px; overflow: hidden; display: grid; place-items: center; background: rgba(2,6,23,.45); border: 1px solid rgba(96,165,250,.22); }
.modal-main-image img { width: 100%; height: 100%; max-height: 520px; object-fit: cover; object-position: top center; }
.gallery-nav { position: absolute; top: 50%; width: 44px; height: 44px; transform: translateY(-50%); }
.gallery-prev { left: 16px; }
.gallery-next { right: 16px; }
.modal-thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
.modal-thumbs button { padding: 0; height: 82px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(96,165,250,.22); background: rgba(2,6,23,.4); cursor: pointer; opacity: .62; }
.modal-thumbs button.active { opacity: 1; border-color: #38bdf8; }
.modal-thumbs img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.modal-info { display: grid; gap: 16px; align-content: start; }
.modal-summary, .modal-detail-box { border-radius: 24px; padding: 24px; }
.modal-summary h3, .modal-detail-box h3 { margin: 0 0 14px; font-size: 22px; }
.price-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 18px; }
.price-grid div { padding: 16px; border-radius: 18px; background: rgba(2,6,23,.34); border: 1px solid rgba(96,165,250,.15); }
.price-grid small { display: block; color: var(--soft); font-weight: 900; }
.price-grid strong { display: block; margin-top: 6px; font-size: 18px; }
.modal-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 26px 26px; }
.modal-detail-box div { display: grid; gap: 10px; }
.modal-detail-box span { display: grid; grid-template-columns: auto 1fr; gap: 10px; color: var(--muted); line-height: 1.5; }
.modal-detail-box svg { color: var(--blue); margin-top: 2px; }
.modal-footer { display: flex; justify-content: space-between; gap: 14px; flex-wrap: wrap; padding: 26px; border-top: 1px solid rgba(96,165,250,.18); }

.reveal-up { animation: revealUp .9s ease both; }
.reveal-float { animation: revealUp .9s ease both, floatCard 7s ease-in-out infinite 1s; }

@keyframes revealUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes glowMove { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(80px,40px,0) scale(1.12); } }
@keyframes shine { 0%, 55% { transform: translateX(-120%); } 80%, 100% { transform: translateX(120%); } }
@keyframes barGrow { from { height: 8%; opacity: .3; } }
@keyframes pulseBadge { 0%,100% { transform: translateY(0) scale(1); box-shadow: 0 24px 80px rgba(0,0,0,.38); } 50% { transform: translateY(-8px) scale(1.02); box-shadow: 0 32px 100px rgba(37,99,235,.35); } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

@media (max-width: 1280px) {
  .container { width: min(1180px, calc(100% - 48px)); }
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-copy { margin: 0 auto; }
  .hero-actions, .hero-checks { justify-content: center; }
  .hero-mockup { width: min(780px, 100%); margin: 0 auto; }
  .slider-left { left: 12px; }
  .slider-right { right: 12px; }
}

@media (max-width: 1050px) {
  .nav-menu { display: none; }
  .proof-grid, .services-grid, .values-grid, .testimonial-grid, .projects-grid { grid-template-columns: repeat(2, 1fr); }
  .testimonial-layout, .about-grid, .modal-body, .final-cta-card { grid-template-columns: 1fr; }
  .final-actions { justify-content: flex-start; }
}

@media (max-width: 760px) {
  .container { width: min(100% - 28px, 680px); }
  .header-inner { min-height: 76px; }
  .brand img { height: 52px; }
  .header-cta { min-height: 44px; padding: 0 14px; font-size: 13px; }
  .hero-section { padding-top: 46px; }
  .hero-copy h1 { font-size: 46px; }
  .hero-copy p { font-size: 16px; }
  .hero-actions .btn { width: 100%; }
  .hero-checks { gap: 14px; font-size: 13px; }
  .hero-mockup { min-height: auto; animation: none; }
  .dashboard-card { grid-template-columns: 1fr; padding: 18px; min-height: auto; }
  .dashboard-sidebar { display: none; }
  .stat-grid { grid-template-columns: 1fr; }
  .phone-card, .floating-badge { display: none; }
  .proof-grid, .services-grid, .values-grid, .testimonial-grid, .projects-grid, .faq-grid, .modal-detail-grid { grid-template-columns: 1fr; }
  .proof-card { border-right: 0; border-bottom: 1px solid rgba(96,165,250,.18); }
  .section-block { padding: 72px 0; }
  .section-head-row { display: grid; align-items: start; }
  .project-image { height: 245px; }
  .project-card { min-height: auto; }
  .slider-btn { display: none; }
  .final-cta-card { padding: 28px; }
  .telegram-icon { width: 74px; height: 74px; border-radius: 24px; }
  .modal-backdrop { padding: 10px; }
  .project-modal { border-radius: 24px; }
  .modal-header, .modal-body, .modal-footer { padding: 18px; }
  .modal-main-image { min-height: 270px; }
  .modal-thumbs { grid-template-columns: repeat(2, 1fr); }
  .price-grid { grid-template-columns: 1fr; }
}


.site-footer {
  position: relative;
  overflow: hidden;
  padding: 34px 0 42px;
  background:
    radial-gradient(circle at 18% 20%, rgba(37, 99, 235, .22), transparent 32%),
    radial-gradient(circle at 82% 10%, rgba(14, 165, 233, .16), transparent 30%),
    linear-gradient(180deg, rgba(2, 6, 23, .4), #020617 46%, #01040d 100%);
  border-top: 1px solid rgba(96, 165, 250, .16);
}

.footer-glow {
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(100px);
  opacity: .7;
}

.footer-glow-1 {
  width: 520px;
  height: 520px;
  left: -240px;
  bottom: -240px;
  background: rgba(37, 99, 235, .26);
  animation: glowMove 12s ease-in-out infinite alternate;
}

.footer-glow-2 {
  width: 460px;
  height: 460px;
  right: -180px;
  top: -160px;
  background: rgba(14, 165, 233, .18);
  animation: glowMove 14s ease-in-out infinite alternate-reverse;
}

.footer-container {
  position: relative;
  z-index: 2;
}

.footer-top {
  display: grid;
  grid-template-columns: minmax(320px, .9fr) minmax(0, 1.4fr);
  gap: 26px;
  align-items: stretch;
}

.footer-brand-card {
  padding: 30px;
  border-radius: 32px;
  min-height: 100%;
  background:
    radial-gradient(circle at 18% 0%, rgba(59, 130, 246, .2), transparent 34%),
    rgba(7, 20, 48, .62);
}

.footer-logo {
  display: inline-flex;
  width: fit-content;
  text-decoration: none;
}

.footer-logo img {
  width: auto;
  height: 72px;
  object-fit: contain;
  filter: drop-shadow(0 0 22px rgba(96, 165, 250, .32));
}

.footer-brand-card p {
  margin: 20px 0 0;
  color: var(--muted);
  line-height: 1.74;
  max-width: 620px;
}

.footer-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.footer-mini-grid span {
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: 16px;
  color: #dbeafe;
  font-weight: 900;
  background: rgba(2, 6, 23, .32);
  border: 1px solid rgba(96, 165, 250, .18);
}

.footer-mini-grid svg {
  color: var(--blue);
  filter: drop-shadow(0 0 10px rgba(56, 189, 248, .4));
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.footer-column {
  padding: 26px;
  border-radius: 28px;
  background: rgba(7, 20, 48, .5);
  border: 1px solid rgba(96, 165, 250, .16);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
}

.footer-column h3 {
  margin: 0 0 18px;
  color: #ffffff;
  font-size: 17px;
  letter-spacing: -.02em;
}

.footer-column a {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #b7c7df;
  text-decoration: none;
  font-weight: 800;
  border-bottom: 1px solid rgba(96, 165, 250, .08);
  transition: .25s ease;
}

.footer-column a:last-child {
  border-bottom: 0;
}

.footer-column a:hover {
  color: #ffffff;
  transform: translateX(4px);
}

.footer-column a svg {
  color: var(--blue);
  opacity: .7;
}

.footer-contact-strip {
  margin-top: 26px;
  padding: 32px;
  border-radius: 32px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  background:
    radial-gradient(circle at 10% 50%, rgba(37, 99, 235, .35), transparent 28%),
    linear-gradient(135deg, rgba(37, 99, 235, .24), rgba(7, 20, 48, .72));
  border-color: rgba(96, 165, 250, .36);
}

.footer-contact-strip h2 {
  margin: 10px 0 0;
  font-size: clamp(28px, 3vw, 46px);
  line-height: 1;
  letter-spacing: -.055em;
}

.footer-contact-strip p {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.footer-bottom {
  margin-top: 26px;
  padding-top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  color: #8ea6c8;
  font-size: 14px;
  border-top: 1px solid rgba(96, 165, 250, .12);
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.footer-bottom a {
  color: #cfe5ff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 800;
  transition: .25s ease;
}

.footer-bottom a:hover {
  color: var(--blue);
}

@media (max-width: 1050px) {
  .footer-top,
  .footer-contact-strip {
    grid-template-columns: 1fr;
  }

  .footer-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 760px) {
  .site-footer {
    padding: 22px 0 34px;
  }

  .footer-links-grid,
  .footer-mini-grid {
    grid-template-columns: 1fr;
  }

  .footer-brand-card,
  .footer-contact-strip,
  .footer-column {
    padding: 22px;
    border-radius: 24px;
  }

  .footer-logo img {
    height: 58px;
  }

  .footer-actions .btn {
    width: 100%;
  }
}


/* Entrada estratégica por seção */
.reveal-on-scroll {
  opacity: 0;
  will-change: opacity, transform, filter;
  transition:
    opacity .9s cubic-bezier(.16, 1, .3, 1),
    transform .9s cubic-bezier(.16, 1, .3, 1),
    filter .9s cubic-bezier(.16, 1, .3, 1);
}
.reveal-on-scroll.is-visible { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
.reveal-up { transform: translate3d(0, 44px, 0); }
.reveal-left { transform: translate3d(-52px, 0, 0); }
.reveal-right { transform: translate3d(52px, 0, 0); }
.reveal-fade { transform: translate3d(0, 0, 0); filter: blur(10px); }
.reveal-zoom { transform: scale(.955); filter: blur(8px); }

/* Dashboard profissional do hero */
.professional-dashboard {
  min-height: 540px;
  grid-template-columns: 188px 1fr;
  gap: 24px;
  padding: 26px;
  border-radius: 38px;
  background:
    radial-gradient(circle at 18% 14%, rgba(59, 130, 246, .24), transparent 31%),
    radial-gradient(circle at 86% 12%, rgba(56, 189, 248, .18), transparent 27%),
    linear-gradient(145deg, rgba(5, 18, 44, .98), rgba(2, 8, 23, .94));
  border-color: rgba(96, 165, 250, .64);
}
.professional-dashboard:after {
  content: "";
  position: absolute;
  inset: 22px;
  border-radius: 30px;
  border: 1px solid rgba(125, 211, 252, .09);
  pointer-events: none;
}
.dashboard-heading-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin: 24px 0 16px;
}
.dashboard-heading-row small {
  display: block;
  color: #8fb7e8;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.dashboard-heading-row h3 {
  margin: 5px 0 0;
  font-size: 28px;
  letter-spacing: -.045em;
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #bfdbfe;
  background: rgba(37, 99, 235, .24);
  border: 1px solid rgba(96, 165, 250, .28);
  font-weight: 950;
  font-size: 12px;
}
.live-badge:before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #38bdf8;
  box-shadow: 0 0 0 0 rgba(56, 189, 248, .65);
  animation: livePulse 1.5s ease-in-out infinite;
}
.professional-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.pro-stat {
  position: relative;
  min-height: 132px;
  padding: 18px;
  overflow: hidden;
  animation: metricEnter .8s cubic-bezier(.16, 1, .3, 1) both;
}
.pro-stat:before {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  right: -52px;
  top: -58px;
  background: rgba(56, 189, 248, .12);
  filter: blur(2px);
}
.stat-icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #93c5fd;
  background: rgba(37, 99, 235, .22);
  border: 1px solid rgba(96, 165, 250, .2);
  margin-bottom: 12px;
}
.analytics-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(190px, .55fr);
  gap: 14px;
  margin-top: 14px;
}
.pro-chart-card {
  height: 254px;
  padding: 18px;
  background:
    linear-gradient(145deg, rgba(7, 20, 48, .82), rgba(2, 8, 23, .74));
}
.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}
.chart-header span { display: block; color: #9fb9dc; font-size: 12px; font-weight: 800; }
.chart-header strong { display: block; color: #fff; margin-top: 4px; font-size: 16px; }
.chart-header em { color: #38bdf8; font-style: normal; font-weight: 950; }
.revenue-chart { width: 100%; height: 180px; overflow: visible; }
.chart-grid-line { stroke: rgba(96, 165, 250, .12); stroke-width: 1; }
.chart-area { fill: url(#areaBlue); opacity: .9; }
.chart-line {
  fill: none;
  stroke: url(#lineBlue);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 760;
  stroke-dashoffset: 760;
  animation: drawLine 2.1s cubic-bezier(.16, 1, .3, 1) forwards .45s;
  filter: drop-shadow(0 0 16px rgba(56, 189, 248, .55));
}
.chart-dot {
  fill: #dbeafe;
  stroke: #38bdf8;
  stroke-width: 4;
  opacity: 0;
  transform-origin: center;
  animation: dotPop .45s ease forwards;
}
.chart-dot:nth-of-type(1) { animation-delay: .8s; }
.chart-dot:nth-of-type(2) { animation-delay: .95s; }
.chart-dot:nth-of-type(3) { animation-delay: 1.1s; }
.chart-dot:nth-of-type(4) { animation-delay: 1.25s; }
.chart-dot:nth-of-type(5) { animation-delay: 1.4s; }
.chart-dot:nth-of-type(6) { animation-delay: 1.55s; }
.side-analytics { display: grid; gap: 14px; }
.conversion-ring, .progress-list {
  border-radius: 20px;
  background: rgba(7, 20, 48, .72);
  border: 1px solid rgba(96,165,250,.16);
  padding: 16px;
}
.conversion-ring {
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: center;
  gap: 12px;
}
.conversion-ring svg { width: 88px; height: 88px; transform: rotate(-90deg); }
.conversion-ring circle:first-child { fill: none; stroke: rgba(96, 165, 250, .14); stroke-width: 12; }
.conversion-ring circle:last-child {
  fill: none;
  stroke: #38bdf8;
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: 302;
  stroke-dashoffset: 302;
  animation: ringProgress 1.8s cubic-bezier(.16, 1, .3, 1) forwards .55s;
  filter: drop-shadow(0 0 13px rgba(56, 189, 248, .55));
}
.conversion-ring strong { display: block; font-size: 26px; letter-spacing: -.04em; }
.conversion-ring span { display: block; color: #9fb9dc; font-size: 12px; line-height: 1.35; }
.progress-list { display: grid; gap: 12px; }
.progress-list span { display: flex; justify-content: space-between; color: #b9cdee; font-size: 12px; font-weight: 900; margin-bottom: 7px; }
.progress-list b { color: #7dd3fc; }
.progress-list i { display: block; height: 8px; border-radius: 999px; overflow: hidden; background: rgba(96, 165, 250, .12); }
.progress-list em { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #2563eb, #38bdf8); animation: progressGrow 1.5s ease both .7s; }
.pro-activity {
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  margin-top: 14px;
}
.pro-activity strong { font-size: 14px; }
.pro-activity span { font-size: 12px; border-left: 1px solid rgba(96, 165, 250, .13); padding-left: 12px; }
.pro-phone-card {
  width: 210px;
  height: 274px;
  right: -36px;
  bottom: 106px;
  padding: 24px;
  animation: phoneFloat 6s ease-in-out infinite;
}
.pro-phone-card span { display: block; margin-top: 44px; }
.pro-phone-card strong { margin-top: 6px; font-size: 28px; }
.pro-phone-card svg { width: 100%; margin-top: 28px; overflow: visible; }
.pro-phone-card svg path:first-child { fill: none; stroke: #38bdf8; stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 0 12px rgba(56, 189, 248, .7)); }
.pro-phone-card svg path:last-child { fill: rgba(56, 189, 248, .16); }

@keyframes drawLine { to { stroke-dashoffset: 0; } }
@keyframes dotPop { to { opacity: 1; transform: scale(1); } from { opacity: 0; transform: scale(.4); } }
@keyframes ringProgress { to { stroke-dashoffset: 40; } }
@keyframes progressGrow { from { width: 0; } }
@keyframes metricEnter { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes livePulse { 70% { box-shadow: 0 0 0 12px rgba(56,189,248,0); } 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); } }
@keyframes phoneFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }

@media (max-width: 1180px) {
  .analytics-grid { grid-template-columns: 1fr; }
  .side-analytics { grid-template-columns: 1fr 1fr; }
  .pro-activity { grid-template-columns: 1fr; }
  .pro-activity span { border-left: 0; padding-left: 0; }
}

@media (max-width: 760px) {
  .reveal-left, .reveal-right, .reveal-up { transform: translate3d(0, 34px, 0); }
  .professional-dashboard { min-height: auto; grid-template-columns: 1fr; }
  .professional-stats { grid-template-columns: 1fr; }
  .side-analytics { grid-template-columns: 1fr; }
  .pro-chart-card { height: auto; }
  .revenue-chart { height: 150px; }
  .pro-phone-card { display: none; }
}

`;
