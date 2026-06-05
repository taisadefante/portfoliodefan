import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { navItems, whatsappUrl } from "./data";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="brand" aria-label="Defan Soluções Digitais">
          <Image src="/logo-white.png" alt="Defan Soluções Digitais" width={260} height={90} priority />
        </a>
        <nav className="nav-menu" aria-label="Menu principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="btn btn-primary header-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
          Solicitar proposta <ArrowRight size={16} />
        </a>
      </div>
    </header>
  );
}
