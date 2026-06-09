import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gamepad2, Smartphone, Play, ShoppingBag, Zap, WalletCards } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { icon: Gamepad2, title: 'Gaming' },
  { icon: Smartphone, title: 'Telecom' },
  { icon: Play, title: 'Streaming' },
  { icon: ShoppingBag, title: 'Retail' },
  { icon: Zap, title: 'Utilities' },
  { icon: WalletCards, title: 'Prepaid value' },
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll('.category-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative w-full py-28 px-6 lg:px-16 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Product Categories
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Digital products customers
            <br />
            <span className="text-gradient-gold">already ask for</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-white/50">
            From gaming and entertainment to telecom and everyday prepaid products, SWARP
            gives customers and merchants easier access to digital value.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="category-card group border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-gold/30 hover:bg-gold/[0.04]"
            >
              <category.icon className="mb-8 h-6 w-6 text-gold/60 transition-colors group-hover:text-gold" />
              <p className="text-sm font-semibold text-white">{category.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
