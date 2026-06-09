import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CreditCard, ArrowRightLeft, Cloud, Layers, Route } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const streams = [
  {
    icon: CreditCard,
    title: 'Transaction Fees',
    description: '% of every payment processed',
    margin: '60–70%',
    scale: '$1T flow = $5–10B revenue',
  },
  {
    icon: ArrowRightLeft,
    title: 'FX Spread',
    description: 'Margin on every cross-border conversion',
    margin: '70–80%',
    scale: '$100B+ sent across Africa annually',
  },
  {
    icon: Cloud,
    title: 'SaaS Subscriptions',
    description: 'Monthly fee for SME & enterprise tools',
    margin: '75–85%',
    scale: '80M African SMEs — nearly all unserved',
  },
  {
    icon: Layers,
    title: 'White-Label Licensing',
    description: 'Banks pay to run on Swarp infrastructure',
    margin: '80–90%',
    scale: 'Recurring institutional contracts',
  },
  {
    icon: Route,
    title: 'Settlement Rails',
    description: 'Per-transaction institutional routing fee',
    margin: '65–75%',
    scale: 'Compounds with every bank onboarded',
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
            Business Model
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Every Transaction.
            <br />
            <span className="text-gradient-gold">Every Transfer.</span>
            <br />
            <span className="text-white/30">Every Day.</span>
          </h2>
          <p className="mt-8 text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            We sit in the middle of every transaction in Africa and take a small cut. 
            At scale, that is extraordinary.
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
            Revenue streams are additive and concurrent. Each new user activates multiple streams simultaneously.
          </p>
        </div>
      </div>
    </section>
  );
}
