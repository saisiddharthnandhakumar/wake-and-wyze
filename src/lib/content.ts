// ============================================================
// Wake & Wyze — Single Source of Truth for ALL Copy
// Every section, headline, FAQ, and citation lives here.
// Update copy in one place.
// ============================================================

// ---- NAVIGATION ----
export const NAV_LINKS = [
  { label: "Science", href: "#science" },
  { label: "Flavors", href: "#flavors" },
  { label: "FAQ", href: "#faq" },
] as const;

// ---- HERO ----
export const HERO = {
  eyebrow: "Specialty Coffee × Lion's Mane",
  headline: "A smarter cup of coffee.",
  subheadline:
    "Premium specialty coffee infused with Lion's Mane Mushroom Extract, sustained energy, sharper focus, and a calmer caffeine experience. In every cup.",
  primaryCta: "Pre Order Now: ₹1,299",
  secondaryCta: "See the research",
  pulsingText: "WAKE & WYZE · FOCUS · CALM · SHARP · ",
  trustItems: [
    "30 servings / 250g",
    "No added sugar",
    "Under 10 calories",
    "Free delivery",
  ],
};

// ---- THE PROBLEM ----
export const PROBLEM = {
  eyebrow: "The Problem",
  headline: "Coffee isn't the problem.\nThe crash is.",
  body: "Most coffee gives you a sharp spike that fades by 2 PM, leaving jitters, brain fog, and the afternoon slump. There's a better way to do mornings.",
  traps: [
    {
      title: "Jitters & anxiety",
      description:
        "A caffeine spike with nothing to buffer it. Heart racing, hands shaking, focus scattered.",
    },
    {
      title: "The 2 PM crash",
      description:
        "Adenosine floods back as caffeine wears off. Your afternoon disappears into fatigue.",
    },
    {
      title: "Acid discomfort",
      description:
        "High acid roasts that leave your stomach unsettled. Not the morning you planned.",
    },
  ],
};

// ---- OUR SOLUTION ----
export const SOLUTION = {
  eyebrow: "Our Solution",
  headline: "Same ritual. Entirely different day.",
  subheadline:
    "Specialty Coffee meets Functionality",
  pillars: [
    {
      number: "01",
      title: "Functional mushroom extract",
      description:
        "Pure Lion's Mane made from 100% fruiting bodies, preserving the bioactive compounds that support focus and mental clarity.",
    },
    {
      number: "02",
      title: "Zero sugar. Low calories.",
      description:
        "No added sugar, sweeteners, or fillers. Under 10 calories per serving. A clean ingredient profile you can trust.",
    },
    {
      number: "03",
      title: "Premium specialty coffee",
      description:
        "Small batch roasted for a rich aroma, balanced body, and smooth finish. Dark roast — 100% Robusta crafted for exceptional taste.",
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
        "Steady release that powers your workday, not just the first two hours.",
    },
    {
      icon: "Brain",
      title: "Sharper Focus",
      description:
        "Lion's Mane supports cognitive clarity. Deep work feels effortless, not forced.",
    },
    {
      icon: "Heart",
      title: "Calm Alertness",
      description:
        "Caffeine gives you energy; Lion's Mane smooths the edges. Stay composed under pressure.",
    },
    {
      icon: "Coffee",
      title: "Premium Taste",
      description:
        "Coffee first, function second. Bold, smooth, and zero mushroom aftertaste.",
    },
    {
      icon: "ShieldCheck",
      title: "Clean Formula",
      description:
        "No added sugar. No artificial flavors. Just premium coffee and Lion's Mane extract.",
    },
  ],
};

// ---- THE SCIENCE ----
export const SCIENCE = {
  eyebrow: "The Science",
  headline: "Backed by research.\nNot marketing.",
  studies: [
    {
      id: 1,
      title: "Improve attention within 60 minutes",
      summary:
        "A single dose improved performance on cognitive tasks within one hour in a double blind, placebo controlled trial.",
      citation: "Docherty et al., 2023 (n=127)",
    },
    {
      id: 2,
      title: "Cognitive improvement with daily use",
      summary:
        "Daily supplementation significantly improved cognitive function scores over 16 weeks in adults with mild cognitive impairment.",
      citation: "Mori et al., 2009",
    },
    {
      id: 3,
      title: "Supports brain cell growth",
      summary:
        "Bioactive compounds in Lion's Mane stimulate proteins that support neuron growth, survival, and brain plasticity.",
      citation: "Contato et al., 2025 (PMC/NIH review)",
    },
  ],
};

// ---- WHY LION'S MANE ----
export const WHY_LIONS_MANE = {
  eyebrow: "Why Lion's Mane",
  headline: "Not a fad.\nA functional mushroom with centuries of history.",
  whatItIs:
    "Lion's Mane (Hericium erinaceus) is an edible mushroom used for centuries in East Asian medicine for brain and gut health. Modern science has identified its key bioactive compounds that support cognitive function.",
  whatItIsNot: [
    "It is NOT psychedelic or psychoactive.",
    "It is NOT a stimulant or synthetic nootropic.",
    "It is NOT untested: decades of research back it.",
  ],
  timeline: [
    { period: "Centuries ago", label: "Traditional Use", description: "Used in Chinese and Japanese medicine for brain and gut health." },
    { period: "1990s–2010s", label: "Modern Research Begins", description: "Scientists identify hericenones and erinacines as NGF stimulating compounds." },
    { period: "2019–2025", label: "Clinical Evidence", description: "Double blind, placebo controlled trials demonstrate cognitive and mood benefits in humans." },
    { period: "Today", label: "Wake & Wyze", description: "Clinical dose Lion's Mane extract blended into premium specialty coffee, for your daily ritual." },
  ],
};

// ---- FAQ ----
export const FAQS = {
  eyebrow: "FAQ",
  headline: "You ask. We answer.",
  items: [
    {
      question: "Will it taste like mushrooms?",
      answer: "No. Our coffee is coffee first. Lion's Mane extract is neutral, and at our formulation it's fully masked within the coffee profile. You'll taste bold, smooth coffee, not mushrooms.",
    },
    {
      question: "Does it contain caffeine?",
      answer: "Yes. Wake & Wyze is made with real specialty coffee. Each cup contains approximately 80–100mg of caffeine, similar to a standard cup of black coffee. The difference is that Lion's Mane smooths the caffeine curve, so you get energy without the jitters.",
    },
    {
      question: "How much Lion's Mane is in each serving?",
      answer: "Each serving contains 1000mg of Lion's Mane extract (100% fruiting body). This dosage aligns with amounts used in published human clinical trials that demonstrated cognitive benefits.",
    },
    {
      question: "How long does one bag last?",
      answer: "One 250g bag contains 30 servings, about one month for daily drinkers. Each serving is about 8–9 grams.",
    },
    {
      question: "Is it vegetarian?",
      answer: "Yes. Wake & Wyze is 100% vegetarian. It contains premium coffee beans and Lion's Mane mushroom extract, nothing else.",
    },
    {
      question: "Is it safe for daily use?",
      answer: "Lion's Mane is generally regarded as safe and is traditionally consumed as a food mushroom. Clinical trials using 1.8–3g/day reported no serious adverse events. As with any dietary change, consult your healthcare provider if you have mushroom allergies, are pregnant or breastfeeding, or are on medication.",
    },
    {
      question: "Is this 'mushroom coffee'?",
      answer: "We prefer 'functional coffee.' Wake & Wyze is specialty coffee first, crafted for taste and your morning ritual. Lion's Mane is the functional ingredient that makes it better than regular coffee. It's coffee, upgraded.",
    },
  ],
};

// ---- FINAL CTA ----
export const FINAL_CTA = {
  headline: "Ready for better mornings?",
  subheadline: "Pre order now. First batches ship soon.",
  cta: "Pre Order Now: ₹1,299",
  trustLine: "30 servings · Free delivery on all pre orders",
};

// ---- FOOTER ----
export const FOOTER = {
  brandLine: "Premium functional coffee for sustained energy, sharper focus, and calmer mornings.",
  links: [
    { label: "The Science", href: "#science" },
    { label: "Flavors", href: "#flavors" },
    { label: "FAQ", href: "#faq" },
    { label: "Pre Order", href: "#preorder" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyright: "© 2026 Wake & Wyze. All rights reserved.",
  contact: "For inquiries contact +91 95587 42935",
};
