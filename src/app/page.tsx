import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { ScienceSection } from "@/components/sections/science-section";
import { WhyLionsManeSection } from "@/components/sections/why-lions-mane-section";
import { TasteSection } from "@/components/sections/taste-section";
import { FlavorSection } from "@/components/sections/flavor-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

const PreOrderSection = dynamic(
  () =>
    import("@/components/preorder/preorder-section").then(
      (mod) => mod.PreOrderSection,
    ),
  { ssr: true, loading: () => <PreOrderFallback /> },
);

function PreOrderFallback() {
  return (
    <section className="py-20 lg:py-28 bg-sage-mist">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-border rounded mb-4" />
          <div className="h-4 w-96 bg-border rounded mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-96 bg-border rounded-2xl" />
            </div>
            <div className="h-64 bg-border rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <ScienceSection />
      <WhyLionsManeSection />
      <TasteSection />
      <FlavorSection />
      <FaqSection />
      <PreOrderSection />
      <FinalCtaSection />
    </>
  );
}
