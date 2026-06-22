"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { whatsappUrl } from "./data";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/#about" },
    { label: "Serviços", href: "/servicos" },

  { label: "Projetos", href: "/projetos" },
  { label: "Tecnologias", href: "/#services" },
  { label: "Contato", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/" || pathname === "/site";

  const navItems = useMemo(() => {
    return isHome
      ? baseNavItems.filter((item) => item.href !== "/")
      : baseNavItems;
  }, [isHome]);

  const proposalButtonStyle: React.CSSProperties = {
    height: 46,
    padding: "0 28px",
    borderRadius: 14,
    border: "1px solid rgba(147,197,253,.45)",
    background: "linear-gradient(135deg,#2563eb,#38bdf8)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
    lineHeight: 1,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 10px 30px rgba(56,189,248,.28)",
    transition: "all .3s ease",
    whiteSpace: "nowrap",
  };

  function scrollToSection(id: string) {
    let tries = 0;

    const attempt = () => {
      const el = document.getElementById(id);

      if (el) {
        const headerOffset = 86;
        const top =
          el.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.history.replaceState(null, "", `#${id}`);

        window.scrollTo({
          top,
          behavior: "smooth",
        });

        return;
      }

      tries += 1;

      if (tries < 60) {
        requestAnimationFrame(attempt);
      }
    };

    requestAnimationFrame(attempt);
  }

  function handleClick(href: string) {
    setOpen(false);

    if (href === "/") {
      router.push("/");
      return;
    }

    if (href === "/projetos") {
      router.push("/projetos");
      return;
    }

    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");

      if (isHome) {
        scrollToSection(id);
        return;
      }

      router.push(`/#${id}`);
      return;
    }

    router.push(href);
  }

  return (
    <>
      <style jsx>{`
        .header-container {
          width: min(1320px, calc(100% - 32px));
          margin: 0 auto;
        }

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

        .proposal-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 38px rgba(56, 189, 248, 0.38) !important;
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
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div
          className="header-container"
          style={{
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <button
            type="button"
            onClick={() => handleClick("/")}
            aria-label="Ir para Home"
            style={{
              display: "flex",
              alignItems: "center",
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
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
          </button>

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
              <button
                key={item.href}
                type="button"
                onClick={() => handleClick(item.href)}
                className="menu-link"
                style={{
                  color: "#dbeafe",
                  fontWeight: 800,
                  fontSize: 15,
                  textDecoration: "none",
                  position: "relative",
                  padding: "8px 0",
                  transition: "all .3s ease",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <a
            className="desktop-cta proposal-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={proposalButtonStyle}
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
            WebkitBackdropFilter: "blur(22px)",
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
            <button
              type="button"
              onClick={() => handleClick("/")}
              aria-label="Ir para Home"
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                cursor: "pointer",
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
            </button>

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
              <button
                key={item.href}
                type="button"
                onClick={() => handleClick(item.href)}
                className="mobile-link"
                style={{
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 900,
                  textDecoration: "none",
                  transition: "all .3s ease",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}

            <a
              className="proposal-cta"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                ...proposalButtonStyle,
                height: 52,
                marginTop: 24,
              }}
            >
              Solicitar proposta <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}