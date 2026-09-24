import trainImg from "@/assets/train-platform.jpg";
import cabinImg from "@/assets/premium-cabin.jpg";
import staffImg from "@/assets/service-staff.jpg";
import sceneryImg from "@/assets/scenery-window.jpg";

const features = [
  {
    title: "Destinations",
    body: "Embark on a voyage covering Nairobi, Athi River, Emali, Kibwezi, Mtito Andei, Voi, Maisenyi, Mariakani, and Mombasa — every trip a new adventure.",
    image: trainImg.src,
  },
  {
    title: "Splendid Moments",
    body: "From exceptional meals to celebrating birthdays and anniversaries onboard SGR trains, enjoy the little things that make every moment unforgettable.",
    image: cabinImg.src,
  },
  {
    title: "Personalized Service",
    body: "Attentive staff cater to your preferences, ensuring your journey is as unique and comfortable as possible — luxury at its best.",
    image: staffImg.src,
  },
  {
    title: "Magnificent Scenery",
    body: "Be captivated by breathtaking views as you travel through Tsavo National Park. Every window offers an exciting new vista.",
    image: sceneryImg.src,
  },
];

export function Features() {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent">Why Travel With Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-3 mb-4">
            An experience beyond the ordinary
          </h2>
          <p className="text-muted-foreground">
            Every detail of your journey, crafted with care and elegance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth border border-border hover:-translate-y-2"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="p-8 pb-4">
                <h3 className="text-2xl font-bold text-primary mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
              <div className="overflow-hidden mx-6 mb-6 rounded-2xl">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  width={1280}
                  height={896}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-smooth duration-700"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
