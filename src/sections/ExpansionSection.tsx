import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe2, Store, Zap, Route } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: Globe2,
    title: 'Local market focus',
    text: 'Moroccan and global product access',
  },
  {
    icon: Store,
    title: 'Merchant-first tools',
    text: 'Built for retailers, resellers, and distribution partners',
  },
  {
    icon: Zap,
    title: 'Digital delivery',
    text: 'Fast access to vouchers, top-ups, and prepaid products',
  },
  {
    icon: Route,
    title: 'Long-term platform vision',
    text: 'Starting with digital products, expanding toward broader digital value services',
  },
];

export function ExpansionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const reasonsRef = useRef<HTMLDivElement>(null);
  const diasporaRef = useRef<HTMLDivElement>(null);

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

      const cards = reasonsRef.current?.querySelectorAll('.reason-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: reasonsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      gsap.fromTo(
        diasporaRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: diasporaRef.current,
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
      id="why-swarp"
      className="relative w-full py-28 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Why SWARP
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Built for Morocco's
            <br />
            <span className="text-gradient-gold">digital commerce market</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-white/50">
            SwarpPay is a digital product and prepaid value platform for Morocco. Customers
            can buy digital products. Merchants can sell them. Partners can distribute them.
          </p>
        </div>

        <div ref={reasonsRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="reason-card border border-white/5 bg-black/30 p-6 transition-all duration-300 hover:border-gold/30 hover:bg-black/50"
            >
              <reason.icon className="mb-8 h-6 w-6 text-gold/70" />
              <h3 className="text-lg font-semibold text-white">{reason.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/45">{reason.text}</p>
            </article>
          ))}
        </div>

        <div
          ref={diasporaRef}
          className="mt-20 border border-gold/15 bg-gold/[0.03] p-7 lg:p-10"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Diaspora
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Connecting Morocco with its global diaspora
          </h3>
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-white/55">
            Moroccans abroad send billions in value home every year. SWARP's long-term
            vision is to connect that existing behavior with easier digital spending,
            merchant access, prepaid products, and future partner-led financial services.
          </p>
          <a
            href="#solution"
            className="mt-8 inline-flex items-center gap-4 border border-gold/40 px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-black"
          >
            Explore SWARP products
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
