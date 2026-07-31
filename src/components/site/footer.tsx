import { FOOTER } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-ink text-surface/80">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <a href="#hero" className="flex items-center gap-2.5 font-display font-semibold text-lg text-surface no-underline mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ww-logo.png"
                alt="Wake & Wyze"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
              Wake &amp; Wyze
            </a>
            <p className="text-sm text-surface/60 leading-relaxed max-w-xs">
              {FOOTER.brandLine}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-surface text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {FOOTER.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-surface/60 hover:text-surface transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-surface text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {FOOTER.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-surface/60 hover:text-surface transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface/10 text-center">
          <p className="text-xs text-surface/40">{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
