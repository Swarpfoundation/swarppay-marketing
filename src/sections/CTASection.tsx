import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltButton } from '@/components/TiltButton';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
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
      id="cta"
      className="relative w-full py-40 lg:py-56 px-6 lg:px-16 bg-black"
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[150px]" />
      </div>

      <div ref={contentRef} className="relative max-w-5xl mx-auto text-center">
        <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-8">
          Investment Opportunity
        </p>

        <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
          Africa is not emerging.
          <br />
          <span className="text-gradient-gold">It has arrived.</span>
        </h2>

        <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
          Swarp Pay is native infrastructure for that Africa. The investors who move at 
          infrastructure moments build the wealth that compounds across decades.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gold">$12M</p>
            <p className="text-white/30 text-xs tracking-wider uppercase mt-1">Seed / Strategic Round</p>
          </div>
          <div className="w-px h-12 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-white">Pre-Money</p>
            <p className="text-white/30 text-xs tracking-wider uppercase mt-1">Early Investor Terms</p>
          </div>
        </div>

        <TiltButton
          className="relative inline-flex items-center gap-4 px-12 py-5 border border-gold/40 text-gold text-sm font-semibold tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 overflow-hidden group"
          onClick={() => {
            window.open('mailto:invest@swarppay.com', '_blank');
          }}
        >
          <span className="relative z-10">Invest in the Infrastructure</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </TiltButton>

        <p className="mt-8 text-white/20 text-xs tracking-wider">
          First-mover terms. Available now.
        </p>
      </div>
    </section>
  );
}
