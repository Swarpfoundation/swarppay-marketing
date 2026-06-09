import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    phase: '01',
    period: '2025–2026',
    title: 'Morocco Foundation',
    items: [
      'Regulatory licensing complete',
      'Consumer wallet + merchant rails live',
      'First institutional partnerships signed',
      'Morocco B2B pipeline established',
    ],
    status: 'Operational Now',
  },
  {
    phase: '02',
    period: '2026–2027',
    title: 'Africa Expansion',
    items: [
      'Nigeria, Kenya, Ghana entry',
      'Cross-border corridors activated',
      'SME treasury product deployed',
      'Strategic bank integrations live',
    ],
    status: 'Phase 2',
  },
  {
    phase: '03',
    period: '2027–2029',
    title: 'Continental Scale',
    items: [
      'Full API platform for institutions',
      'White-label deployed with 3+ banks',
      '10+ active corridors operating',
      'Series B institutional raise',
    ],
    status: 'Phase 3',
  },
];

const markets = [
  { name: 'Morocco', role: 'Anchor & HQ', status: 'active' },
  { name: 'Egypt', role: 'North Africa Entry', status: 'phase2' },
  { name: 'Nigeria', role: 'West Africa Lead', status: 'phase2' },
  { name: 'Kenya', role: 'East Africa Lead', status: 'phase2' },
  { name: 'Ghana', role: 'High-Adoption', status: 'phase2' },
  { name: 'Rwanda', role: 'High-Adoption', status: 'phase3' },
];

export function ExpansionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);
  const marketsRef = useRef<HTMLDivElement>(null);

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

      const phaseCards = phasesRef.current?.querySelectorAll('.phase-card');
      if (phaseCards) {
        gsap.fromTo(
          phaseCards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: phasesRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const marketItems = marketsRef.current?.querySelectorAll('.market-item');
      if (marketItems) {
        gsap.fromTo(
          marketItems,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: marketsRef.current,
              start: 'top 80%',
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
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Go to Market
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Phased Expansion.
            <br />
            <span className="text-gradient-gold">Institutional-Led.</span>
          </h2>
        </div>

        <div ref={phasesRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 lg:mb-28">
          {phases.map((phase) => (
            <div
              key={phase.phase}
              className="phase-card group relative p-8 lg:p-10 border border-white/5 hover:border-gold/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-6xl lg:text-7xl font-bold text-white/5 group-hover:text-gold/10 transition-colors leading-none">
                  {phase.phase}
                </span>
                <span className={`text-[10px] tracking-wider uppercase px-3 py-1 border ${
                  phase.status === 'Operational Now'
                    ? 'border-gold/30 text-gold bg-gold/5'
                    : 'border-white/10 text-white/40'
                }`}>
                  {phase.status}
                </span>
              </div>

              <p className="text-gold/60 text-xs tracking-wider uppercase mb-2">{phase.period}</p>
              <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6">{phase.title}</h3>

              <ul className="space-y-3">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/50 text-sm">
                    <div className="w-1 h-1 bg-gold/40 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Market Map */}
        <div>
          <p className="text-white/30 text-xs tracking-wider uppercase mb-8 text-center">
            Target Markets
          </p>
          <div ref={marketsRef} className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {markets.map((market) => (
              <div
                key={market.name}
                className={`market-item px-5 py-3 border ${
                  market.status === 'active'
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-white/10 bg-white/[0.02]'
                } hover:border-gold/30 transition-all duration-300`}
              >
                <p className={`text-sm font-semibold ${market.status === 'active' ? 'text-gold' : 'text-white'}`}>
                  {market.name}
                </p>
                <p className="text-white/30 text-[10px] mt-0.5">{market.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
