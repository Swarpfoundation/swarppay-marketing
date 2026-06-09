import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CreditCard, Store, Cloud, Layers, Route } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const streams = [
  {
    icon: CreditCard,
    title: 'Marketplace Sales',
    description: 'Consumer purchases of gift cards, vouchers, top-ups, and prepaid products',
    margin: 'Product margin',
    scale: 'Starts with everyday digital demand',
  },
  {
    icon: Store,
    title: 'Merchant Distribution',
    description: 'Retailers and resellers access digital products through the merchant portal',
    margin: 'B2B margin',
    scale: 'Expands through local retail channels',
  },
  {
    icon: Cloud,
    title: 'Dashboard Access',
    description: 'Approved partners and larger accounts use catalog, reporting, and distribution tools',
    margin: 'Platform fees',
    scale: 'Supports controlled partner operations',
  },
  {
    icon: Layers,
    title: 'Partner Integrations',
    description: 'Commercial integrations with approved distributors and B2B partners',
    margin: 'Partner revenue',
    scale: 'Grows with product and channel depth',
  },
  {
    icon: Route,
    title: 'Diaspora-Linked Roadmap',
    description: 'Long-term opportunity to connect diaspora-supported value with digital spending',
    margin: 'Future products',
    scale: 'Roadmap item, not the starting product',
  },
];

export function RevenueSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const streamsRef = useRef<HTMLDivElement>(null);

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

      const streamCards = streamsRef.current?.querySelectorAll('.stream-card');
      if (streamCards) {
        gsap.fromTo(
          streamCards,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: streamsRef.current,
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
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Commercial Model
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Digital products.
            <br />
            <span className="text-gradient-gold">Merchant distribution.</span>
            <br />
            <span className="text-white/30">Partner tools.</span>
          </h2>
          <p className="mt-8 text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            SWARP starts with digital products and merchant distribution, then expands
            toward broader value-added services as the platform and partner network mature.
          </p>
        </div>

        <div ref={streamsRef} className="space-y-4">
          {streams.map((stream, index) => (
            <div
              key={stream.title}
              className="stream-card group relative flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 p-6 lg:p-8 border border-white/5 hover:border-gold/20 bg-black/20 hover:bg-black/40 transition-all duration-500"
            >
              <div className="flex items-center gap-4 lg:w-1/4">
                <span className="text-gold/30 text-xs font-mono">0{index + 1}</span>
                <stream.icon className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
                <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-gold transition-colors">
                  {stream.title}
                </h3>
              </div>

              <div className="lg:w-1/4">
                <p className="text-white/40 text-sm">{stream.description}</p>
              </div>

              <div className="lg:w-1/4 flex items-center gap-3">
                <div className="px-3 py-1 border border-gold/20 bg-gold/5">
                  <span className="text-gold text-xs font-semibold">{stream.margin} margin</span>
                </div>
              </div>

              <div className="lg:w-1/4 lg:text-right">
                <p className="text-white/50 text-xs lg:text-sm">{stream.scale}</p>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-gold/40 to-transparent group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            The roadmap is staged around live digital commerce needs first, with future services added only as operational and legal requirements are met.
          </p>
        </div>
      </div>
    </section>
  );
}
