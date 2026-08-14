"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { CurrencyToggle } from "@/components/currency/currency-toggle";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const darkOverlay = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/90 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center shrink-0 no-underline"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ww-logo.png"
              alt="Wake & Wyze"
              width={112}
              height={112}
              className={cn(
                "h-28 w-auto",
                // invert works in modern browsers; -webkit-filter covers older Safari/iOS
                darkOverlay && "invert [-webkit-filter:invert(100%)]",
              )}
            />
            <span className="sr-only">Wake &amp; Wyze</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  darkOverlay
                    ? "text-surface/70 hover:text-surface"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop currency toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <CurrencyToggle onDark={darkOverlay} />
            <a href="#preorder">
              <Button
                variant={darkOverlay ? "hero-outline" : "primary"}
                size="sm"
              >
                Pre Order Now
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X size={22} className="text-ink" />
            ) : (
              <Menu size={22} className={darkOverlay ? "text-surface" : "text-ink"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="px-6 pb-6 pt-2 flex flex-col gap-4 border-t border-border bg-surface">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base text-ink-muted hover:text-ink transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2">
            <CurrencyToggle />
          </div>
          <a href="#preorder" className="mt-2" onClick={() => setMobileOpen(false)}>
            <Button variant="primary" className="w-full">
              Pre Order Now
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
