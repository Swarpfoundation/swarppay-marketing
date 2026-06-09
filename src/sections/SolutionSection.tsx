import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Store, LayoutDashboard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const productDoors = [
  {
    icon: Gift,
    title: 'Gift Card Marketplace',
    label: 'For customers',
    description:
      'For customers who want to buy gift cards, gaming vouchers, streaming cards, telecom top-ups, and other prepaid products.',
    cta: 'Buy Gift Cards',
    href: 'https://giftcard.swarppay.com/',
  },
  {
    icon: Store,
    title: 'Merchant Portal',
    label: 'For merchants & resellers',
    description:
      'For retailers, shops, resellers, telecom sellers, cyber cafes, and local businesses that want to sell digital products to their customers.',
    cta: 'Start Selling',
    href: 'https://merchant.swarppay.com/',
  },
  {
    icon: LayoutDashboard,
    title: 'Master Dashboard',
    label: 'For approved partners',
    description:
      'For internal operators, distributors, approved partners, or larger B2B accounts that need catalog, reporting, and distribution control.',
    cta: 'Partner Dashboard',
    href: 'https://master.swarppay.com/',
  },
];

export function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

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

      const productCards = productsRef.current?.querySelectorAll('.product-door');
      if (productCards) {
        gsap.fromTo(
          productCards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: productsRef.current,
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
      id="solution"
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Product
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Choose the right
            <br />
            <span className="text-gradient-gold">SwarpPay door.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-white/50">
            Three clear entry points for customers, local sellers, and approved partners.
          </p>
        </div>

        <div ref={productsRef} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {productDoors.map((product, index) => (
            <article
              key={product.title}
              className="product-door group relative flex min-h-[360px] flex-col border border-white/5 bg-black/30 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold/30 hover:bg-black/50"
            >
              <div className="mb-10 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center border border-gold/20 text-gold transition-colors group-hover:bg-gold/10">
                  <product.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-gold/40">0{index + 1}</span>
              </div>

              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
                {product.label}
              </p>
              <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-gold">
                {product.title}
              </h3>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-white/50">
                {product.description}
              </p>
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-between border border-gold/30 bg-gold/[0.06] px-5 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-black"
              >
                {product.cta}
                <span aria-hidden="true">-&gt;</span>
              </a>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-gold/60 to-transparent transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
