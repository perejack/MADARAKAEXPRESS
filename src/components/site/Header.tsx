import { useState } from "react";
import { Menu, X, Train } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { label: "Book a Train", href: "#book" },
  { label: "Manage Booking", href: "#manage" },
  { label: "Stations", href: "#stations" },
  { label: "About Us", href: "#about" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground text-xs py-2 px-6 flex justify-between items-center relative z-50">
        <div className="flex gap-4"></div>
        <div className="hidden sm:flex gap-4">
          <a href={`mailto:${siteConfig.supportEmail}`} className="opacity-90 hover:opacity-100 transition-smooth">
            {siteConfig.supportEmail}
          </a>
          <span className="opacity-50">|</span>
          <a href="#about" className="opacity-90 hover:opacity-100 transition-smooth">
            About us
          </a>
        </div>
      </div>

      <header className="absolute left-0 right-0 z-40 bg-transparent">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-12 md:h-14 w-12 md:w-14 rounded-xl bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-smooth">
              <Train className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-white font-bold text-lg leading-tight drop-shadow-md">
                {siteConfig.businessName}
              </span>
              <span className="block text-white/80 text-xs font-medium">Private ticket booking</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-smooth hover:bg-white/10 text-white/95"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-white"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden bg-primary/95 backdrop-blur-md animate-fade-up">
            <div className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg text-white hover:bg-white/10 transition-smooth"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
