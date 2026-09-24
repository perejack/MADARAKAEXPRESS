import { Phone, Mail, Facebook, Twitter, Youtube, Train } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <h4 className="text-accent font-bold text-lg mb-4">About {siteConfig.businessName}</h4>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            We are a private travel booking platform helping passengers reserve seats on Kenya&apos;s
            Standard Gauge Railway (SGR) routes, including Madaraka Express services.
          </p>
          <p className="text-sm leading-relaxed text-primary-foreground/70 mt-3 border-l-2 border-accent/50 pl-3">
            {siteConfig.fullDisclaimer}
          </p>
        </div>

        <div>
          <h4 className="text-accent font-bold text-lg mb-4">Contact us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{siteConfig.supportPhone} — Customer support</span>
            </li>
            <li className="flex gap-3">
              <Mail className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{siteConfig.supportEmail}</span>
            </li>
          </ul>
          <p className="text-xs text-primary-foreground/60 mt-4">
            For official Kenya Railways inquiries, visit{" "}
            <a
              href="https://krc.co.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              krc.co.ke
            </a>
          </p>
        </div>

        <div>
          <h4 className="text-accent font-bold text-lg mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            {["Book a Train", "How it works", "Payments", "About us", "Benefits", "FAQs"].map((l) => (
              <li key={l}>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">
                  ▸ {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-accent font-bold text-lg mb-4">Legal</h4>
          <ul className="space-y-2 text-sm mb-6">
            {["Contact", "Privacy Policy", "Terms of Service", "Refund Policy"].map((l) => (
              <li key={l}>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-smooth">
                  ▸ {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            {[Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-smooth"
                aria-label="Social link"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-primary-foreground/70">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-accent" />
            <span className="font-semibold">{siteConfig.businessName}</span>
          </div>
          <span>{siteConfig.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
