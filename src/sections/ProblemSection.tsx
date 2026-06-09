import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, Clock, TrendingDown, Unlink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: TrendingDown, label: 'Product Access', value: 'Fragmented', benchmark: 'Customers search across many channels', delay: 0 },
  { icon: Clock, label: 'Fulfillment Speed', value: 'Manual', benchmark: 'Retailers need faster digital delivery', delay: 0.15 },
  { icon: Unlink, label: 'Catalog Control', value: 'Scattered', benchmark: 'Partners need one operating view', delay: 0.3 },
  { icon: AlertTriangle, label: 'Merchant Tooling', value: 'Limited', benchmark: 'Local sellers need simple digital tools', delay: 0.45 },
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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

      const statCards = statsRef.current?.querySelectorAll('.stat-card');
      if (statCards) {
        gsap.fromTo(
          statCards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
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
      id="problem"
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            The Problem
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-4xl">
            Broken by Design.
            <br />
            <span className="text-white/30">Not by Accident.</span>
          </h2>
          <p className="mt-8 text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            This is not only a technology gap. It is a product access and distribution
            gap. Customers want digital products, while local sellers need simpler tools
            to offer them reliably.
          </p>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card group relative p-6 lg:p-8 border border-white/5 hover:border-gold/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
            >
              <stat.icon className="w-5 h-5 text-gold/60 mb-6 group-hover:text-gold transition-colors" />
              <p className="text-white/40 text-xs tracking-wider uppercase mb-3">{stat.label}</p>
              <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/30 text-xs">{stat.benchmark}</p>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-gold/40 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        <div className="mt-16 lg:mt-24 p-6 lg:p-10 border border-white/5 bg-white/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-10">
            {[
              { label: 'Product Access', africa: 'Scattered', global: 'Unified' },
              { label: 'Fulfillment', africa: 'Manual', global: 'Instant' },
              { label: 'Catalog', africa: 'Fragmented', global: 'Controlled' },
              { label: 'Merchant Tools', africa: 'Limited', global: 'Self-Serve' },
              { label: 'Partner Reporting', africa: 'Basic', global: 'Centralized' },
            ].map((row) => (
              <div key={row.label} className="text-center">
                <p className="text-white/30 text-[10px] tracking-wider uppercase mb-4">{row.label}</p>
                <div className="flex flex-col gap-2">
                  <span className="text-red-400/80 text-sm font-semibold">{row.africa}</span>
                  <div className="w-full h-px bg-white/5" />
                  <span className="text-white/40 text-xs">{row.global}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
