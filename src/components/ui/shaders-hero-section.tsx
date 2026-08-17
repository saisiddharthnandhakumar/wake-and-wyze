"use client";

import { PulsingBorder, MeshGradient } from "@paper-design/shaders-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { HERO } from "@/lib/content";
import { PRICE_PAISE } from "@/lib/constants";
import { formatPrice } from "@/lib/order";
import { useCurrency } from "@/components/currency/currency-provider";
import { Button } from "@/components/ui/button";

// ── SVG Filters ──────────────────────────────────────────────────────────────

function ShaderSvgFilters() {
  return (
    <svg className="absolute inset-0 w-0 h-0">
      <defs>
        <filter
          id="ww-glass-effect"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0.02
                    0 1 0 0 0.02
                    0 0 1 0 0.05
                    0 0 0 0.9 0"
            result="tint"
          />
        </filter>
        <filter
          id="ww-gooey-filter"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

// ── Shader Background ────────────────────────────────────────────────────────

function ShaderBackground({
  children,
  simplified,
}: {
  children: React.ReactNode;
  simplified?: boolean;
}) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-ink">
      {simplified ? (
        // Reduced-motion / low-power fallback — static gradient instead of
        // the two animated MeshGradient layers (which are GPU-heavy on mobile).
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #241811 0%, #3A2A1D 30%, #96552A 60%, #5C6A4B 100%)",
          }}
          aria-hidden="true"
        />
      ) : (
        <>
          <ShaderSvgFilters />

          {/* Primary MeshGradient — warm espresso / bronze / sage */}
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={[
              "#241811",
              "#3A2A1D",
              "#96552A",
              "#C1793C",
              "#5C6A4B",
              "#8A6A4B",
              "#2C2018",
            ]}
            speed={0.2}
            style={{ backgroundColor: "#241811" }}
          />

          {/* Wireframe overlay — lighter tones for texture */}
          <MeshGradient
            className="absolute inset-0 w-full h-full opacity-40"
            colors={["#241811", "#F6F1E7", "#96552A", "#3A2A1D"]}
            speed={0.15}
            style={{ backgroundColor: "transparent" }}
          />
        </>
      )}

      {/* Bottom fade — very gradual dark-to-light transition over 35% of the viewport,
          ending at the Pipo gradient base color for a seamless blend */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35vh] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(36,24,17,0.25) 40%, rgba(36,24,17,0.1) 70%, #FAF9EF 100%)",
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}

// ── Pulsing Circle ───────────────────────────────────────────────────────────

function PulsingCircle() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="absolute bottom-4 right-4 z-30 lg:bottom-8 lg:right-8">
      <div className="relative w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center">
        {/* Pulsing Border ring with brand colors */}
        <PulsingBorder
          colors={["#96552A", "#F6F1E7", "#5C6A4B"]}
          colorBack="#241811"
          speed={1.5}
          roundness={1}
          thickness={0.1}
          softness={0.2}
          intensity={5}
          spots={5}
          spotSize={0.1}
          pulse={0.1}
          smoke={0.5}
          smokeSize={4}
          scale={0.65}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
          }}
        />

        {/* Rotating text ring */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={shouldReduce ? {} : { rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path
              id="ww-circle-path"
              d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text className="text-[8px] fill-white/80" fontFamily="Montserrat">
            <textPath href="#ww-circle-path" startOffset="0%">
              {HERO.pulsingText}
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  );
}

// ── Hero Content ─────────────────────────────────────────────────────────────

function HeroContent() {
  const { currency } = useCurrency();
  return (
    <div className="text-left">
      {/* Eyebrow badge with glass effect */}
      {HERO.eyebrow && (
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{ filter: "url(#ww-glass-effect)" }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-surface/90 text-xs font-light relative z-10">
            {HERO.eyebrow}
          </span>
        </div>
      )}

      {/* Headline */}
      <h1 className="font-display text-4xl font-light tracking-tight text-balance text-surface sm:text-5xl lg:text-6xl leading-[1.05]">
        {HERO.headline}
      </h1>

      {/* Subheadline */}
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-surface/70">
        {HERO.subheadline}
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a href="#preorder" className="inline-block">
          <Button variant="hero-filled" size="lg">
            {`${HERO.primaryCta}: ${formatPrice(PRICE_PAISE, currency)}`}
          </Button>
        </a>
        <a href="#science" className="inline-block">
          <Button variant="hero-outline" size="lg">
            {HERO.secondaryCta}
          </Button>
        </a>
      </div>

      {/* Trust row */}
      <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-surface/60">
        {HERO.trustItems.map((item, index) => (
          <span key={item} className="flex items-center gap-3">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-sage"
              />
            )}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Hero Product Image ───────────────────────────────────────────────────────

function HeroProductImage() {
  return (
    <div className="relative mx-auto w-[90%] sm:w-[78%] md:w-[70%] lg:w-full">
      {/* Subtle ground shadow to seat the composition on the scene */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-10 w-2/3 -translate-x-1/2 rounded-full bg-black/30 blur-xl lg:bg-black/25"
      />
      <div className="relative aspect-[1310/1200] w-full">
        <Image
          src="/images/transparent-hero.png"
          alt="Wake & Wyze specialty coffee pouch and cup with Lion's Mane mushroom, steam, coffee beans, and wooden tray"
          fill
          sizes="(max-width: 639px) 85vw, (max-width: 1023px) 70vw, 40vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}

// ── Composed Hero Section ────────────────────────────────────────────────────

export function HeroSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-ink min-h-dvh"
    >
      <ShaderBackground simplified={Boolean(shouldReduce)}>
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8 pt-24 pb-16 lg:pt-28 lg:pb-20 min-h-dvh flex flex-col justify-center">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] lg:gap-12">
            <HeroContent />
            <HeroProductImage />
          </div>
        </div>

        <PulsingCircle />
      </ShaderBackground>
    </section>
  );
}
