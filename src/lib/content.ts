// ============================================================
// Wake & Wyze — Single Source of Truth for ALL Copy
// Every section, headline, FAQ, testimonial, and citation
// lives here. Update copy in one place.
// ============================================================

// ---- NAVIGATION ----
export const NAV_LINKS = [
  { label: "Science", href: "#science" },
  { label: "Flavors", href: "#flavors" },
  { label: "FAQ", href: "#faq" },
] as const;

// ---- HERO ----
export const HERO = {
  eyebrow: null, // We don't label it "mushroom coffee" — outcomes first
  headline: "Your morning, without the crash.",
  headlineAlt: "Same ritual. Entirely different day.",
  subheadline:
    "Premium specialty coffee infused with Lion's Mane. Sustained energy, sharper focus, and a calmer caffeine experience — in every cup.",
  primaryCta: "Pre-Order Now — ₹1,299",
  secondaryCta: "See the research",
  trustItems: [
    "30 servings / 250g",
    "No added sugar",
    "Under 10 calories",
    "Pay by UPI",
  ],
};

// ---- THE PROBLEM ----
export const PROBLEM = {
  eyebrow: "The Problem",
  headline: "Coffee isn't the problem.\nThe crash is.",
  body: "Most coffees are built for a spike — a sharp jolt of caffeine that peaks by 10 AM and leaves you drained by 2 PM. Jitters, anxiety, brain fog, and that afternoon slump you can't shake. You deserve better mornings than this.",
  traps: [
    {
      title: "Jitters & anxiety",
      description:
        "A 100–200mg caffeine spike with nothing to buffer it. Your heart races, your hands shake, and your focus scatters.",
    },
    {
      title: "The 2 PM crash",
      description:
        "Adenosine floods back as caffeine wears off. Your afternoon disappears into fatigue and brain fog.",
    },
    {
      title: "Acid discomfort",
      description:
        "High-acid roasts that leave your stomach unsettled. Not exactly how you planned to spend your morning.",
    },
  ],
};

// ---- OUR SOLUTION ----
export const SOLUTION = {
  eyebrow: "Our Solution",
  headline: "Same ritual. Entirely different day.",
  subheadline:
    "Specialty coffee meets functional Lion's Mane. No jitters. No crash. Just clarity that lasts from your first sip to your last meeting.",
  pillars: [
    {
      number: "01",
      title: "Functional mushroom extracts",
      description:
        "Dual-extracted Lion's Mane made from 100% fruiting bodies — preserving the bioactive compounds that support focus and mental clarity.",
    },
    {
      number: "02",
      title: "Zero sugar. Low calories.",
      description:
        "No added sugar, sweeteners, fillers, or grain starch. Under 10 calories per serving with a clean ingredient profile you can trust.",
    },
    {
      number: "03",
      title: "Premium specialty coffee",
      description:
        "Small-batch roasted for a rich aroma, balanced body, and a smooth, low-acidity finish. An 80:20 blend crafted for exceptional taste.",
    },
  ],
};

// ---- BENEFITS ----
export const BENEFITS = {
  eyebrow: "Benefits",
  headline: "What you get with every cup.",
  cards: [
    {
      icon: "Zap",
      title: "Sustained Energy",
      description:
        "Steady release that powers your entire workday — not just the first two hours. No spike, no crash.",
    },
    {
      icon: "Brain",
      title: "Sharper Focus",
      description:
        "Lion's Mane supports cognitive clarity and attention. Deep work sessions feel effortless, not forced.",
    },
    {
      icon: "Heart",
      title: "Calm Alertness",
      description:
        "The 'focus + calm' effect. Caffeine gives you energy; Lion's Mane smooths the edges so you stay composed under pressure.",
    },
    {
      icon: "Coffee",
      title: "Premium Taste",
      description:
        "Coffee first, function second. Bold, smooth, and satisfying — without a hint of mushroom aftertaste.",
    },
    {
      icon: "ShieldCheck",
      title: "Clean Formula",
      description:
        "No added sugar. No artificial flavors. No fillers. Just premium coffee and functional Lion's Mane extract.",
    },
  ],
};

// ---- HOW IT WORKS ----
export const HOW_IT_WORKS = {
  eyebrow: "How It Works",
  headline: "One cup. Dual mechanism.",
  steps: [
    {
      step: 1,
      title: "Premium Coffee",
      description:
        "Specialty beans roasted in small batches. The rich, full-bodied coffee you already love — now working harder for you.",
    },
    {
      step: 2,
      title: "Lion's Mane Extract",
      description:
        "250–500mg of dual-extracted Lion's Mane (100% fruiting body). The dose used in published human clinical trials.",
    },
    {
      step: 3,
      title: "Your Daily Ritual",
      description:
        "Brew it like your regular coffee. Black, with milk, hot or iced. Same habit. Entirely different result.",
    },
    {
      step: 4,
      title: "Sustained Focus",
      description:
        "Caffeine for immediate alertness. Lion's Mane for all-day clarity. The 'one cup, dual-mechanism' advantage.",
    },
  ],
};

// ---- THE SCIENCE ----
export const SCIENCE = {
  eyebrow: "The Science",
  headline: "Backed by research.\nNot marketing.",
  subheadline:
    "Lion's Mane is one of the most studied functional mushrooms in the world. Here's what the evidence says — in plain language.",
  studies: [
    {
      id: 1,
      title: "Improved attention within 60 minutes",
      summary:
        "A 28-day randomized, double-blind, placebo-controlled trial in healthy adults (aged 18–45) found that a single 1.8g dose of Lion's Mane improved performance speed on the Stroop task — a standard test of selective attention and cognitive control — within one hour of ingestion. Over 28 days, participants also showed a trend toward reduced subjective stress.",
      citation: "Docherty et al., 2023 (n=127)",
      reference: "The Acute and Chronic Effects of Lion's Mane Mushroom Supplementation on Cognitive Function, Stress, and Mood in Young Adults.",
    },
    {
      id: 2,
      title: "Cognitive improvement with daily use",
      summary:
        "A 16-week trial in older adults (aged 50–80) with mild cognitive impairment found that 3g/day of Lion's Mane significantly improved cognitive function scores during the supplementation period. Benefits diminished after discontinuation, supporting the case for daily, ongoing use.",
      citation: "Mori et al., 2009",
      reference: "Improving effects of Lion's Mane on cognitive function in older adults with mild cognitive impairment.",
    },
    {
      id: 3,
      title: "Supports nerve growth and brain plasticity",
      summary:
        "Preclinical research shows that hericenones and erinacines — bioactive compounds found in Lion's Mane — stimulate Nerve Growth Factor (NGF) and Brain-Derived Neurotrophic Factor (BDNF). These proteins support the growth, survival, and plasticity of neurons, which may help maintain cognitive function under stress and during aging.",
      citation: "Contato et al., 2025 (PMC/NIH review)",
      reference: "A systematic review of Lion's Mane (Hericium erinaceus): mechanisms, preclinical data, and human clinical evidence.",
    },
  ],
  disclaimer:
    "These statements have not been evaluated by FSSAI. This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. The research cited is on Lion's Mane mushroom in general; Wake & Wyze contains Lion's Mane as part of a coffee blend.",
  citations: [
    "Contato, A. G. et al. (2025). Lion's Mane Mushroom (Hericium erinaceus) — PMC/NIH Review.",
    "Docherty, S. et al. (2023). The Acute and Chronic Effects of Lion's Mane Mushroom Supplementation on Cognitive Function, Stress, and Mood in Young Adults (n=127).",
    "Mori, K. et al. (2009). Improving effects of Lion's Mane on cognitive function in older adults with mild cognitive impairment.",
    "India Functional Mushrooms Market (2025–2031) — Industry Trends & Forecast.",
    "Frequently Asked Questions — Coffee with Adaptogens | Two Roads.",
    "Lion's Mane coffee: how to make it and optimal dosing — research-backed guide.",
    "A Systematic Review of in-vivo Studies on Dietary Mushroom Supplementation.",
    "Surendran, G. et al. (2025). Acute effects of a standardised extract of Hericium erinaceus.",
  ],
};

// ---- WHY LION'S MANE ----
export const WHY_LIONS_MANE = {
  eyebrow: "Why Lion's Mane",
  headline: "Not a fad.\nA functional mushroom with centuries of history.",
  whatItIs:
    "Lion's Mane (Hericium erinaceus) is an edible, white, shaggy mushroom used for centuries in East Asian traditional medicine — particularly in China and Japan — for supporting brain and gut health. Modern science has identified its key bioactive compounds: hericenones, erinacines, and polysaccharides.",
  whatItIsNot: [
    "It is NOT psychedelic or psychoactive.",
    "It is NOT a stimulant or synthetic nootropic.",
    "It is NOT untested — decades of preclinical and clinical research back it.",
  ],
  timeline: [
    { period: "Centuries ago", label: "Traditional Use", description: "Used in Chinese and Japanese medicine for brain and gut health." },
    { period: "1990s–2010s", label: "Modern Research Begins", description: "Scientists identify hericenones and erinacines as NGF-stimulating compounds." },
    { period: "2019–2025", label: "Clinical Evidence", description: "Double-blind, placebo-controlled trials demonstrate cognitive and mood benefits in humans." },
    { period: "Today", label: "Wake & Wyze", description: "Clinical-dose Lion's Mane extract blended into premium specialty coffee — for your daily ritual." },
  ],
};

// ---- TASTE ----
export const TASTE = {
  eyebrow: "Taste",
  headline: "It tastes like coffee.\nBecause it is coffee.",
  body: "Lion's Mane extract is neutral to slightly earthy in taste. At our formulation levels, it is fully masked within the coffee profile — just as it is in leading global Lion's Mane coffee products. The result? Bold, smooth coffee with zero mushroom aftertaste.",
  flavorNotes: ["Dark chocolate", "Toasted hazelnut", "Velvety finish", "Zero mushroom aftertaste"],
};

// ---- SOCIAL PROOF ----
export const TESTIMONIALS = {
  eyebrow: "Social Proof",
  headline: "Built for high performers.",
  subheadline: "People whose output depends on how their brain feels at hour nine.",
  items: [
    {
      initials: "RK",
      name: "Rahul K.",
      role: "Software Engineer, Bangalore",
      quote: "I used to crash hard by 3 PM — every single day. With Wake & Wyze, my afternoons feel as sharp as my mornings. It's my non-negotiable now.",
    },
    {
      initials: "AS",
      name: "Anjali S.",
      role: "Product Manager, Mumbai",
      quote: "I was skeptical about anything with 'mushroom' in it. But it genuinely tastes like good coffee — and the sustained focus is real. No jitters, no anxiety.",
    },
    {
      initials: "VM",
      name: "Vikram M.",
      role: "Founder, Delhi NCR",
      quote: "As a founder, my calendar is back-to-back from 7 AM. This is the only coffee that keeps me level-headed through the last meeting of the day.",
    },
  ],
};

// ---- FAQ ----
export const FAQS = {
  eyebrow: "FAQ",
  headline: "You ask. We answer.",
  items: [
    {
      question: "Will it taste like mushrooms?",
      answer: "No. Our coffee is coffee-first. Lion's Mane extract is neutral to slightly earthy, and at our formulation levels, it is fully masked within the coffee profile. You'll taste bold, smooth coffee — not mushrooms.",
    },
    {
      question: "Does it contain caffeine?",
      answer: "Yes. Wake & Wyze is made with real specialty coffee. Each cup contains approximately 80–100mg of caffeine — similar to a standard cup of black coffee. The difference is that Lion's Mane smooths the caffeine curve, so you get energy without the jitters.",
    },
    {
      question: "How much Lion's Mane is in each serving?",
      answer: "Each serving contains 250–500mg of dual-extracted Lion's Mane (100% fruiting body). This dosage aligns with amounts used in published human clinical trials that demonstrated cognitive benefits.",
    },
    {
      question: "When should I drink it?",
      answer: "In the morning, like your regular coffee. Acute effects on attention and cognitive performance have been observed within 60 minutes of consumption. For long-term cognitive support, daily use over several weeks is recommended based on clinical trial protocols.",
    },
    {
      question: "How long does one bag last?",
      answer: "One 250g bag contains 30 servings — approximately one month for daily drinkers. Each serving is about 8–9 grams of coffee.",
    },
    {
      question: "Is it vegetarian?",
      answer: "Yes. Wake & Wyze is 100% plant-based. It contains premium coffee beans and Lion's Mane mushroom extract — nothing else.",
    },
    {
      question: "Is it safe for daily use?",
      answer: "Lion's Mane is generally regarded as safe and is traditionally consumed as a food mushroom. Human clinical trials using 1.8–3g/day for several weeks to months reported no serious adverse events. As with any dietary change, individuals with mushroom allergies, pregnant or breastfeeding women, and those on multiple medications should consult their healthcare provider.",
    },
    {
      question: "Can I cancel my pre-order?",
      answer: "Yes. You can cancel your pre-order any time before dispatch. Once your order ships, our standard return policy applies. See our Terms page for details.",
    },
    {
      question: "Where do you ship?",
      answer: "We ship across India. Delivery is free on all pre-orders. Estimated delivery times will be communicated when your batch is ready to ship.",
    },
    {
      question: "Is this 'mushroom coffee'?",
      answer: "We prefer 'functional coffee.' Wake & Wyze is specialty coffee first — crafted for taste and your morning ritual. Lion's Mane is the functional ingredient that makes it better than regular coffee. It's coffee, upgraded — not mushroom water.",
    },
  ],
};

// ---- FINAL CTA ----
export const FINAL_CTA = {
  headline: "Ready for better mornings?",
  subheadline: "Pre-order now. First batches ship soon.",
  cta: "Pre-Order Now — ₹1,299",
  trustLine: "30 servings · Free delivery on pre-orders · Pay by UPI",
};

// ---- FOOTER ----
export const FOOTER = {
  brandLine: "Premium functional coffee for sustained energy, sharper focus, and calmer mornings.",
  links: [
    { label: "The Science", href: "#science" },
    { label: "Flavors", href: "#flavors" },
    { label: "FAQ", href: "#faq" },
    { label: "Pre-Order", href: "#preorder" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyright: "© 2026 Wake & Wyze. All rights reserved.",
};
