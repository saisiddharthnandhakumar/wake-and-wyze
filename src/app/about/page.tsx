import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">About Wake & Wyze</h1>
        <p className="text-ink-muted text-sm mb-8">Coffee that works as hard as you do.</p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Our Story
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Wake & Wyze was born from a simple observation: coffee gives you energy for two hours,
          then takes it all back. The afternoon crash, the jitters, the brain fog — none of that
          is your fault. It&apos;s just how regular coffee works.
        </p>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          We set out to build a better cup. One that delivers sustained energy, sharper focus,
          and a calm alertness that carries you through the entire day — not just the first meeting.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          What We Make
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Wake & Wyze is premium instant specialty coffee infused with Lion&apos;s Mane mushroom
          extract. Each 250g bag contains 30 servings of dark-roast instant coffee blended with
          1000mg of pure Lion&apos;s Mane (100% fruiting body) per serving.
        </p>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          No added sugar. No artificial flavors. No fillers. Just bold, smooth coffee and a
          functional ingredient backed by decades of scientific research. Just add hot water
          and stir — no brewing equipment needed.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Where Our Coffee Comes From
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Our Robusta is single-origin from Chikkamagaluru, Karnataka — the region where Indian
          coffee began. In the 17th century, coffee was first planted in the Baba Budan Giri hills,
          and Chikkamagaluru has grown it ever since.
        </p>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          The beans grow at elevation in the Western Ghats, shade-grown under native forest trees
          and rain-fed by the southwest monsoon — conditions that give Robusta its signature full
          body and clean, low-acid finish. We keep it simple: one origin, small-batch roasted, no
          blends.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Our Promise
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-muted text-sm mb-4">
          <li className="leading-relaxed">
            <strong>Quality first:</strong> single-origin Robusta from Chikkamagaluru, Karnataka — small-batch roasted. Lion&apos;s Mane
            from fruiting bodies only — no mycelium filler.
          </li>
          <li className="leading-relaxed">
            <strong>Transparency:</strong> Every ingredient and dosage is listed clearly. No hidden
            blends, no proprietary formulas behind a wall.
          </li>
          <li className="leading-relaxed">
            <strong>Science-backed:</strong> Our Lion&apos;s Mane dosage aligns with published human
            clinical trials. We cite our sources.
          </li>
          <li className="leading-relaxed">
            <strong>Customer-first:</strong> Free shipping across India. 7-10 business day delivery.
            Cancel anytime before dispatch for a full refund.
          </li>
        </ul>

        <div className="mt-10">
          <Link href="/" className="text-sm text-sage hover:text-sage-deep transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
