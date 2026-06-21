"use client";

import { useEffect, useMemo, useState } from "react";
import { getProjects } from "@/lib/firestore";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import TechMarquee from "@/components/home/TechMarquee";
import Services from "@/components/home/Services";
import About from "@/components/home/About";
import ProjectsSection from "@/components/home/ProjectsSection";
import SocialProof from "@/components/home/SocialProof";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import FinalCta from "@/components/home/FinalCta";
import Footer from "@/components/home/Footer";
import ProjectDetailsModal from "@/components/home/ProjectDetailsModal";
import { Project } from "@/components/home/types";
import { styles } from "@/components/home/styles";
import MensalidadeSection from "@/components/home/MensalidadeSection";


export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects()
      .then((list) => {
        const typedList = list as Project[];
        const highlighted = typedList.filter(
          (item) => item.highlight !== false,
        );
        setProjects(highlighted.length ? highlighted : typedList);
      })
      .catch(() => setProjects([]));
  }, []);

  const subscriptionProjects = useMemo(() => {
    return projects.filter((project) => {
      const model = String(project.commercialModel || "").toLowerCase();
      return (
        model.includes("assinatura") ||
        model.includes("mensal") ||
        model.includes("recorrente")
      );
    });
  }, [projects]);

  return (
    <main className="premium-page">
      <style>{styles}</style>
      <div className="page-glow page-glow-1" />
      <div className="page-glow page-glow-2" />
      <Header />
      <Hero />
      <TechMarquee />
      <SocialProof />
      <Services />
            <MensalidadeSection />

      <About />
      <ProjectsSection
        id="projetos"
        eyebrow="Projetos em destaque"
        title="Portfólios, sistemas e soluções que mostram valor antes da proposta"
        description="Projetos com visual forte, estrutura profissional e foco em conversão, automação e operação."
        projects={projects}
        ctaHref="/projetos"
        ctaLabel="Ver todos os projetos"
        onOpen={setSelectedProject}
      />
      {subscriptionProjects.length > 0 && (
        <ProjectsSection
          id="assinaturas"
          eyebrow="Sistemas por assinatura"
          title="Comece agora com estrutura profissional"
          description="Soluções prontas para negócios que querem começar com baixo investimento e evoluir com segurança."
          projects={subscriptionProjects}
          ctaHref="/assinaturas"
          ctaLabel="Ver todos os planos"
          onOpen={setSelectedProject}
        />
      )}
      <Testimonials />
      <FaqSection />
      <FinalCta />
      <Footer />
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}
