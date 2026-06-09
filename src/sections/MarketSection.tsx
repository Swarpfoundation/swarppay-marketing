import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Store } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  'Access one digital product catalog',
  'Sell vouchers and top-ups',
  'Track activity from a portal',
  'Reduce manual supplier complexity',
  'Offer more products to customers',
  'Get onboarding and support',
];

export function MarketSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
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
      id="merchants"
      className="relative w-full py-28 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            For Merchants And Resellers
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight">
            Add digital products
            <br />
            <span className="text-gradient-gold">to your business</span>
          </h2>
          <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-white/50">
            SwarpPay helps retailers, telecom sellers, cyber cafés, electronics shops,
            service points, and local distributors sell digital products without building
            their own infrastructure.
          </p>
          <a
            href="https://merchant.swarppay.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-4 border border-gold/40 px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-black"
          >
            Become a SWARP merchant
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>

        <div className="border border-white/5 bg-black/30 p-6 lg:p-8">
          <div className="mb-8 flex h-14 w-14 items-center justify-center border border-gold/20 text-gold">
            <Store className="h-6 w-6" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 border border-white/5 bg-white/[0.02] p-4">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <p className="text-sm leading-relaxed text-white/60">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
