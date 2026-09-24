import trainImg from "@/assets/train-platform.jpg";
import zebraImg from "@/assets/zebra.jpg";
import staffImg from "@/assets/service-staff.jpg";

const news = [
  { tag: "Fleet", title: "Modern locomotives connecting nations", image: trainImg.src },
  { tag: "Wildlife", title: "Spot zebras across the Tsavo plains", image: zebraImg.src },
  { tag: "Onboard", title: "Five-star service at every stop", image: staffImg.src },
];

export function News() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-primary via-primary-glow to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.82 0.17 80 / 0.4), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.55 0.21 30 / 0.6), transparent 50%)"
      }} />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-14">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent">Latest News</span>
          <h2 className="text-4xl md:text-6xl font-bold mt-3 max-w-3xl leading-tight">
            Get to learn more about our travel experiences
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <article
              key={n.title}
              className="group rounded-3xl overflow-hidden relative h-96 shadow-elegant hover:shadow-glow transition-smooth hover:-translate-y-2"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <img
                src={n.image}
                alt={n.title}
                loading="lazy"
                width={1280}
                height={896}
                className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold tracking-wider uppercase mb-3">
                  {n.tag}
                </span>
                <h3 className="text-2xl font-bold text-white">{n.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
