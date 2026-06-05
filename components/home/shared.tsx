"use client";

import type { CSSProperties, ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { colors } from "./homeData";

export function SectionTitle({ eyebrow, title, center = true }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div style={{ maxWidth: 980, margin: center ? "0 auto 54px" : "0 0 28px", textAlign: center ? "center" : "left" }}>
      <span style={{ display: "inline-flex", color: colors.gold, letterSpacing: "0.17em", textTransform: "uppercase", fontSize: 12, fontWeight: 950, marginBottom: 14 }}>{eyebrow}</span>
      {title && <h2 style={{ margin: 0, color: colors.text, fontSize: "clamp(30px, 3.55vw, 56px)", lineHeight: 1.02, letterSpacing: "-0.06em" }}>{title}</h2>}
    </div>
  );
}

export function DetailList({ title, items }: { title: string; items?: string[] }) {
  const cleanItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleanItems.length) return null;
  return (
    <section style={{ padding: 22, borderRadius: 26, background: "rgba(2, 6, 23, 0.34)", border: "1px solid rgba(125, 211, 252, 0.14)" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 20, letterSpacing: "-0.03em" }}>{title}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {cleanItems.map((item, index) => (
          <div key={`${title}-${item}-${index}`} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "flex-start", color: colors.muted, lineHeight: 1.55 }}>
            <CheckCircle2 size={17} color={colors.gold} style={{ marginTop: 2 }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GlassCard({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return <article className={className} style={{ background: "linear-gradient(180deg, rgba(15,23,42,.78), rgba(8,47,73,.42))", border: "1px solid rgba(125,211,252,.15)", borderRadius: 32, padding: 26, boxShadow: "0 24px 80px rgba(0,0,0,.18)", ...style }}>{children}</article>;
}
