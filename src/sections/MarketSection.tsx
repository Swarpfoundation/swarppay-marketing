import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Smartphone, ArrowRightLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const marketStats = [
  { icon: TrendingUp, value: '$3.4T', label: 'GDP by 2030', sub: '5%+ annual growth' },
  { icon: Users, value: '1.4B', label: 'People', sub: "World's youngest market" },
  { icon: Smartphone, value: '60%', label: 'Underbanked', sub: 'Directly addressable' },
  { icon: ArrowRightLeft, value: '$100B+', label: 'Cross-Border Flows', sub: 'Priced at 4x global average' },
];

export function MarketSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

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

      const statCards = statsRef.current?.querySelectorAll('.market-stat');
      if (statCards) {
        gsap.fromTo(
          statCards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      gsap.fromTo(
        quoteRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="market"
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-black"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Why Africa, Why Now
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            The Biggest Untapped
            <br />
            <span className="text-gradient-gold">Market on Earth.</span>
          </h2>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 lg:mb-28">
          {marketStats.map((stat) => (
            <div
              key={stat.label}
              className="market-stat group relative p-8 lg:p-10 border border-white/5 hover:border-gold/20 bg-white/[0.02] hover:bg-gold/[0.03] transition-all duration-500"
            >
              <stat.icon className="w-6 h-6 text-gold/40 mb-6 group-hover:text-gold transition-colors" />
              <p className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 tracking-tight">
                {stat.value}
              </p>
              <p className="text-white/70 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-white/30 text-xs">{stat.sub}</p>
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div ref={quoteRef} className="relative pl-6 lg:pl-10 border-l-2 border-gold/30">
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80 leading-snug max-w-3xl">
            "China 2000. Southeast Asia 2010. <span className="text-gold font-medium">Africa is 2025.</span>
            Those who entered early built generational wealth."
          </p>
          <p className="mt-6 text-white/30 text-xs tracking-[0.2em] uppercase">
            The infrastructure gap is real. The timing is now.
          </p>
        </div>
      </div>
    </section>
  );
}
