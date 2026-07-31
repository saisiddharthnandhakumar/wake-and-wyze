import { FAQS } from "@/lib/content";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";

export function FaqSection() {
  const items = FAQS.items.map((item, index) => ({
    id: `faq-${index + 1}`,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="section-eyebrow">{FAQS.eyebrow}</p>
            <h2 className="section-heading">{FAQS.headline}</h2>
          </Reveal>

          <Reveal delay={100} className="mt-12">
            <Accordion items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
