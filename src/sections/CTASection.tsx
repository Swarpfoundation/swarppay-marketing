import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const actions = [
  { label: 'Buy Gift Cards', href: 'https://giftcard.swarppay.com/' },
  { label: 'Merchant Portal', href: 'https://merchant.swarppay.com/' },
  { label: 'Master Dashboard', href: 'https://master.swarppay.com/' },
];

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
      id="cta"
      className="relative w-full py-32 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[520px] h-[520px] bg-gold/[0.04] rounded-full blur-[150px]" />
      </div>

      <div ref={contentRef} className="relative max-w-5xl mx-auto text-center">
        <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-8">
          Get Started
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-8">
          Start with
          <br />
          <span className="text-gradient-gold">SWARP</span>
        </h2>
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold/30 bg-gold/[0.06] px-5 py-4 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-black"
            >
              {action.label}
            </a>
          ))}
        </div>
        <p className="mt-8 text-sm text-white/45">
          For partnerships:{' '}
          <a href="mailto:maniar@swarppay.com" className="text-gold hover:underline">
            maniar@swarppay.com
          </a>
        </p>
      </div>
    </section>
  );
}
