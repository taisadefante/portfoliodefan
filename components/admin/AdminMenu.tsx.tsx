"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const items = [
  { href: "/admin", label: "Projetos", key: "projetos" },
  { href: "/admin/leads", label: "Leads", key: "leads" },
  { href: "/admin/vendas", label: "Vendas", key: "vendas" },
  { href: "/admin/financeiro", label: "Financeiro", key: "financeiro" },
];

export default function AdminMenu() {
  const pathname = usePathname();
  const current = pathname.replace(/\/$/, "");

  function isActive(key: string) {
    if (key === "projetos") {
      return current === "/admin" || current === "/admin/projetos";
    }

    return current === `/admin/${key}` || current.startsWith(`/admin/${key}/`);
  }

  const menuStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 12,
    margin: "0 0 28px",
    padding: 14,
    borderRadius: 26,
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    flexWrap: "wrap",
  };

  const baseItemStyle: CSSProperties = {
    minWidth: 145,
    padding: "15px 24px",
    borderRadius: 16,
    textAlign: "center",
    color: "#cbd5e1",
    background: "rgba(2, 6, 23, 0.42)",
    border: "1px solid rgba(125, 211, 252, 0.12)",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 900,
  };

  const activeItemStyle: CSSProperties = {
    color: "#ffffff",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.38), rgba(56,189,248,0.24))",
    border: "1px solid rgba(56, 189, 248, 0.95)",
    boxShadow:
      "0 0 0 1px rgba(56,189,248,0.25), 0 0 24px rgba(56,189,248,0.28), 0 14px 34px rgba(14,165,233,0.34)",
  };

  return (
    <nav style={menuStyle}>
      {items.map((item) => {
        const active = isActive(item.key);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              ...baseItemStyle,
              ...(active ? activeItemStyle : {}),
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
