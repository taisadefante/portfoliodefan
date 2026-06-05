"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { navItems, whatsappUrl } from "./data";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        .menu-link:hover {
          color: #38bdf8 !important;
          text-shadow: 0 0 14px rgba(56, 189, 248, 0.45);
        }

        .menu-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #2563eb, #38bdf8);
          transition: width 0.35s ease;
        }

        .menu-link:hover::after {
          width: 100%;
        }

        .mobile-link:hover {
          color: #38bdf8 !important;
          transform: translateX(10px);
        }

        @media (max-width: 1100px) {
          .desktop-nav,
          .desktop-cta {
            display: none !important;
          }

          .mobile-menu-btn {
            display: flex !important;
          }
        }

        @media (min-width: 1101px) {
          .mobile-menu-btn,
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: "rgba(2,6,23,.74)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div
          className="container"
          style={{
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <a
            href="/"
            aria-label="Defan Soluções Digitais"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={128}
              height={44}
              priority
              style={{
                width: 128,
                height: "auto",
                objectFit: "contain",
              }}
            />
          </a>

          <nav
            className="desktop-nav"
            aria-label="Menu principal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 34,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="menu-link"
                style={{
                  color: "#dbeafe",
                  fontWeight: 800,
                  fontSize: 15,
                  textDecoration: "none",
                  position: "relative",
                  padding: "8px 0",
                  transition: "all .3s ease",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="btn btn-primary desktop-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Solicitar proposta <ArrowRight size={16} />
          </a>

          <button
            className="mobile-menu-btn"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            style={{
              display: "none",
              width: 46,
              height: 46,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.06)",
              color: "#fff",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="mobile-menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "radial-gradient(circle at top right, rgba(56,189,248,.14), transparent 35%), rgba(2,6,23,.97)",
            backdropFilter: "blur(22px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 70,
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={118}
              height={42}
              priority
              style={{
                width: 118,
                height: "auto",
                objectFit: "contain",
              }}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.1)",
                background: "rgba(255,255,255,.06)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "40px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 28,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="mobile-link"
                style={{
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 900,
                  textDecoration: "none",
                  transition: "all .3s ease",
                }}
              >
                {item.label}
              </a>
            ))}

            <a
              className="btn btn-primary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 24 }}
            >
              Solicitar proposta <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
