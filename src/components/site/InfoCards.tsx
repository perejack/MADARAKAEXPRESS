import trainImg from "@/assets/train-platform.jpg";
import cabinImg from "@/assets/premium-cabin.jpg";
import sceneryImg from "@/assets/scenery-window.jpg";
import nairobiImg from "@/assets/nairobi-terminus.jpg";
import { ArrowUpRight } from "lucide-react";

const cards = [
  { title: "How Booking Works", image: trainImg.src },
  { title: "Terms of Service", image: cabinImg.src },
  { title: "Routes & Fares", image: sceneryImg.src },
  { title: "Travel Guidelines", image: nairobiImg.src },
];

export function InfoCards() {
  return (
    <section id="stations" className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-hero rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-elegant">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] border-2 border-dashed border-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 border-2 border-dashed border-white/10 rounded-full translate-y-1/2" />

          <div className="relative text-center mb-14">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent">Discover</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
              Plan your SGR journey with{" "}
              <span className="text-gradient-gold">confidence</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((c, i) => (
              <a
                key={c.title}
                href="#"
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-smooth hover:-translate-y-3"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="w-full h-48 sm:h-44 object-cover group-hover:scale-110 transition-smooth duration-700"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <span className="font-semibold text-foreground text-base">{c.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-primary shrink-0 group-hover:rotate-45 transition-smooth" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
