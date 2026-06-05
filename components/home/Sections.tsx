"use client";

import type { CSSProperties } from "react";
import { ArrowRight, MessageCircle, Phone, Star } from "lucide-react";
import { carouselItems, colors, faqs, services, testimonials, values, whatsappUrl } from "./homeData";
import { GlassCard, SectionTitle } from "./shared";

type BaseProps = { isMobile: boolean; isTablet: boolean; isNotebook: boolean; containerStyle: CSSProperties; cardStyle: CSSProperties; buttonStyle: CSSProperties; outlineButtonStyle: CSSProperties; sectionStyle: CSSProperties; marqueeOffset?: number };

export function TechMarquee({ isTablet, marqueeOffset = 0 }: Pick<BaseProps, "isTablet" | "marqueeOffset">) {
  return <section className="animate-fade-up delay-3" style={{ width: isTablet ? "min(92%, 760px)" : "84%", maxWidth: 1320, margin: "0 auto 8px", padding: "18px 0", overflow: "hidden", background: "rgba(15, 23, 42, 0.58)", border: "1px solid rgba(250, 204, 21, 0.14)", borderRadius: isTablet ? 28 : 999 }} aria-label="Serviços e tecnologias">
    <div style={{ width: "max-content", display: "flex", gap: 14, paddingInline: 14, transform: `translateX(-${marqueeOffset}px)` }}>
      {[...carouselItems, ...carouselItems, ...carouselItems].map((item, index) => <span key={`${item}-${index}`} style={{ flex: "0 0 auto", padding: "10px 18px", borderRadius: 999, color: "#fef3c7", fontWeight: 900, background: "rgba(250, 204, 21, 0.08)", border: "1px solid rgba(250, 204, 21, 0.14)", fontSize: 14 }}>{item}</span>)}
    </div>
  </section>;
}

export function ServicesSection({ isTablet, isNotebook, containerStyle, cardStyle, sectionStyle }: BaseProps) {
  return <section id="servicos" style={sectionStyle}><div style={containerStyle}>
    <SectionTitle eyebrow="Serviços" title="Soluções digitais para empresas que precisam transmitir confiança" />
    <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : isNotebook ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 22 }}>
      {services.map((service, index) => { const Icon = service.icon; return <article key={service.title} className="home-service-card" style={{ ...cardStyle, minHeight: 280, animationDelay: `${0.1 + index * 0.08}s` }}>
        <div style={{ width: 62, height: 62, display: "grid", placeItems: "center", color: colors.gold, borderRadius: 22, background: "rgba(250, 204, 21, 0.1)", border: "1px solid rgba(250, 204, 21, 0.16)" }}><Icon size={25} /></div>
        <h3 style={{ margin: "26px 0 12px", fontSize: 23, letterSpacing: "-0.04em" }}>{service.title}</h3>
        <p style={{ color: colors.muted, lineHeight: 1.68 }}>{service.description}</p>
      </article>; })}
    </div>
  </div></section>;
}

export function AboutSection({ isMobile, isTablet, isNotebook, containerStyle, cardStyle, sectionStyle }: BaseProps) {
  return <section id="sobre" style={{ ...sectionStyle, background: "rgba(15, 23, 42, 0.2)" }}><div style={{ ...containerStyle, display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1.1fr 0.9fr", gap: 26 }}>
    <article style={{ ...cardStyle, padding: isMobile ? 28 : 38 }}>
      <span style={{ color: colors.gold, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: 12, fontWeight: 950 }}>Sobre a Defan</span>
      <h2 style={{ margin: "18px 0", color: colors.text, fontSize: "clamp(28px, 3.35vw, 52px)", lineHeight: 1.04, letterSpacing: "-0.052em" }}>Cada projeto é criado para representar melhor a empresa por trás da tela.</h2>
      <p style={{ color: colors.muted, lineHeight: 1.68 }}>A Defan Soluções Digitais cria páginas, sites, sistemas e automações para empresas que querem melhorar sua presença online, apresentar seus serviços com mais profissionalismo e vender com mais segurança.</p>
      <p style={{ color: colors.muted, lineHeight: 1.68 }}>O objetivo não é apenas criar uma tela bonita. É construir uma solução que comunique valor, facilite o contato do cliente e ajude o negócio a funcionar melhor no dia a dia.</p>
    </article>
    <article style={{ ...cardStyle, padding: isMobile ? 28 : 38 }}>
      <span style={{ color: colors.gold, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: 12, fontWeight: 950 }}>Criado por</span>
      <h3 style={{ margin: "16px 0", fontSize: 34, letterSpacing: "-0.05em" }}>Tais Defante</h3>
      <p style={{ color: colors.muted, lineHeight: 1.68 }}>A Defan é conduzida por Tais Defante, com foco em desenvolvimento, design, automação, organização de processos e criação de soluções digitais para negócios reais.</p>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 14, color: "#fef3c7", textDecoration: "none", fontWeight: 950 }}><MessageCircle size={18} /> Conversar sobre meu projeto</a>
    </article>
  </div>
  <div style={{ ...containerStyle, display: "grid", gridTemplateColumns: isTablet ? "1fr" : isNotebook ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 22, marginTop: 26 }}>
    {values.map((value, index) => { const Icon = value.icon; return <article key={value.title} className="home-value-card" style={{ ...cardStyle, padding: 28, animationDelay: `${0.1 + index * 0.1}s` }}><Icon size={25} color={colors.gold} /><h3 style={{ margin: "26px 0 12px", fontSize: 22 }}>{value.title}</h3><p style={{ color: colors.muted, lineHeight: 1.68 }}>{value.text}</p></article>; })}
  </div></section>;
}

export function ProofSocialSection({ isMobile, isTablet, containerStyle, sectionStyle }: BaseProps) {
  const proof = [["5.0", "Avaliação média", "Experiência profissional e atendimento próximo"], ["100%", "Projetos responsivos", "Sites e sistemas pensados para celular e desktop"], ["SaaS", "Sistemas escaláveis", "Painéis, assinaturas, automações e integrações"], ["RJ", "Atendimento Brasil", "Projetos digitais para empresas de diferentes segmentos"]];
  return <section style={{ ...sectionStyle, paddingTop: isMobile ? 40 : 72 }}><div style={containerStyle}>
    <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "0.95fr 1.05fr", gap: 26, alignItems: "center", padding: isMobile ? 24 : 34, borderRadius: 38, background: "radial-gradient(circle at 10% 0%, rgba(250,204,21,.16), transparent 32%), linear-gradient(135deg, rgba(15,23,42,.88), rgba(8,47,73,.52))", border: "1px solid rgba(250,204,21,.18)", boxShadow: "0 30px 100px rgba(0,0,0,.28)" }}>
      <div><span style={{ color: colors.gold, fontWeight: 950, letterSpacing: ".15em", textTransform: "uppercase", fontSize: 12 }}>Prova social</span><h2 style={{ margin: "14px 0 0", fontSize: "clamp(30px,3.5vw,56px)", lineHeight: 1.03, letterSpacing: "-.06em" }}>Mais confiança antes do primeiro clique.</h2><p style={{ color: colors.muted, lineHeight: 1.7, fontSize: 18 }}>Sua página precisa passar segurança, valor e profissionalismo em segundos. Esse é o papel de uma presença digital premium.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 14 }}>{proof.map(([number, title, text], index) => <GlassCard key={title} className="proof-card" style={{ animationDelay: `${0.1 + index * 0.08}s`, padding: 22 }}><div style={{ display: "flex", gap: 4, color: colors.gold, marginBottom: 14 }}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div><strong style={{ display: "block", fontSize: 34, letterSpacing: "-.06em" }}>{number}</strong><b style={{ display: "block", marginTop: 4 }}>{title}</b><span style={{ display: "block", color: colors.muted, marginTop: 8, lineHeight: 1.55 }}>{text}</span></GlassCard>)}</div>
    </div>
  </div></section>;
}

export function TestimonialsSection({ isTablet, isNotebook, containerStyle, cardStyle, sectionStyle }: BaseProps) {
  return <section id="depoimentos" style={{ ...sectionStyle, background: "rgba(15, 23, 42, 0.24)" }}><div style={containerStyle}>
    <SectionTitle eyebrow="Depoimentos" title="Credibilidade também é construída pela forma como sua empresa se apresenta" />
    <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : isNotebook ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 22 }}>
      {testimonials.map((item, index) => <article key={item.name} className="home-testimonial-card" style={{ ...cardStyle, animationDelay: `${0.1 + index * 0.1}s` }}><div style={{ display: "flex", gap: 4, color: colors.gold, marginBottom: 22 }}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div><p style={{ color: colors.muted, lineHeight: 1.68 }}>{item.text}</p><strong style={{ display: "block", marginTop: 24 }}>{item.name}</strong><span style={{ color: "#93c5fd", fontSize: 14 }}>{item.company}</span></article>)}
    </div>
  </div></section>;
}

export function FaqSection({ isTablet, containerStyle, cardStyle, sectionStyle }: BaseProps) {
  return <section id="faq" style={sectionStyle}><div style={containerStyle}><SectionTitle eyebrow="FAQ" title="Perguntas importantes antes de iniciar um projeto" /><div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: 26, alignItems: "start" }}>{faqs.map((item, index) => <article key={item.question} className="home-faq-card" style={{ ...cardStyle, padding: 28, animationDelay: `${0.1 + index * 0.08}s` }}><h3 style={{ margin: "0 0 12px", fontSize: 20 }}>{item.question}</h3><p style={{ color: colors.muted, lineHeight: 1.68 }}>{item.answer}</p></article>)}</div></div></section>;
}

export function ContactCTA({ isMobile, containerStyle, buttonStyle, outlineButtonStyle }: BaseProps) {
  return <section id="contato" style={{ padding: isMobile ? "76px 0" : "112px 0", background: "radial-gradient(circle at 50% 0%, rgba(250,204,21,0.16), transparent 32%), radial-gradient(circle at 50% 20%, rgba(14,165,233,0.18), transparent 38%), linear-gradient(135deg, rgba(15,23,42,0.82), rgba(8,47,73,0.46))", borderTop: "1px solid rgba(250, 204, 21, 0.14)", borderBottom: "1px solid rgba(125, 211, 252, 0.12)" }}><div style={{ ...containerStyle, textAlign: "center" }}>
    <span style={{ display: "inline-flex", color: colors.gold, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: 12, fontWeight: 950, marginBottom: 16 }}>Próximo passo</span>
    <h2 style={{ maxWidth: 920, margin: "0 auto", color: colors.text, fontSize: "clamp(32px, 4.3vw, 66px)", lineHeight: 1.02, letterSpacing: "-0.06em" }}>Vamos transformar sua presença digital em algo mais profissional?</h2>
    <p style={{ maxWidth: 760, margin: "22px auto 0", color: colors.muted, lineHeight: 1.72, fontSize: 18 }}>Me conte o que você precisa: site, landing page, sistema, automação, painel administrativo ou assinatura mensal.</p>
    <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 34 }}><a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ ...buttonStyle, padding: "16px 26px", width: isMobile ? "100%" : "auto" }}>Chamar no WhatsApp <MessageCircle size={19} /></a><a href="tel:+5521988359825" style={{ ...outlineButtonStyle, padding: "16px 26px", width: isMobile ? "100%" : "auto" }}>Ligar agora <Phone size={18} /></a></div>
  </div></section>;
}
