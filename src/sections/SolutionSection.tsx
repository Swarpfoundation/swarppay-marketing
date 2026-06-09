import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WebGLRipple } from '@/components/WebGLRipple';
import { Smartphone, Store, Building2, Landmark, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    icon: Smartphone,
    title: 'Consumer',
    description: 'Digital wallet · Domestic payments · P2P transfers',
    features: ['Mobile-first — not mobile-adapted', 'Instant onboarding', 'Multi-currency support'],
  },
  {
    icon: Store,
    title: 'Merchant',
    description: 'POS acceptance · QR payments · Reconciliation',
    features: ['Cross-border by default', 'Same-day settlement', 'Zero hardware required'],
  },
  {
    icon: Building2,
    title: 'SME',
    description: 'Collections · FX treasury · Payroll rails',
    features: ['Compliance embedded at inception', 'Automated FX hedging', 'Bulk disbursements'],
  },
  {
    icon: Landmark,
    title: 'Enterprise',
    description: 'Settlement rails · Institutional APIs · White-label infra',
    features: ['API-first architecture', 'Built for mixed banking', '99.99% uptime SLA'],
  },
];

export function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

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

      const layerCards = layersRef.current?.querySelectorAll('.layer-card');
      if (layerCards) {
        gsap.fromTo(
          layerCards,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: layersRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (imagesRef.current) {
        gsap.fromTo(
          imagesRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imagesRef.current,
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
      id="solution"
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            The Solution
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            One Platform.
            <br />
            <span className="text-gradient-gold">Every Layer</span> of African Finance.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Layer Cards */}
          <div ref={layersRef} className="space-y-4">
            {layers.map((layer, index) => (
              <div
                key={layer.title}
                className="layer-card group relative p-6 lg:p-8 border border-white/5 hover:border-gold/20 bg-black/30 hover:bg-black/50 transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-gold/20 text-gold group-hover:bg-gold/10 transition-colors">
                    <layer.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-gold/40 text-xs font-mono">0{index + 1}</span>
                      <h3 className="text-xl lg:text-2xl font-semibold text-white group-hover:text-gold transition-colors">
                        {layer.title}
                      </h3>
                    </div>
                    <p className="text-white/40 text-sm mb-4">{layer.description}</p>
                    <ul className="space-y-2">
                      {layer.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-white/50 text-xs">
                          <Check className="w-3 h-3 text-gold/60" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WebGL Ripple Images */}
          <div ref={imagesRef} className="space-y-6">
            <div className="relative w-full aspect-[3/2] overflow-hidden border border-white/5">
              <WebGLRipple imageUrl="/ripple1.jpg" className="w-full h-full" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5">
                <span className="text-white/60 text-[10px] tracking-wider uppercase">Liquid Infrastructure</span>
              </div>
            </div>
            <div className="relative w-full aspect-[3/2] overflow-hidden border border-white/5">
              <WebGLRipple imageUrl="/ripple2.jpg" className="w-full h-full" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5">
                <span className="text-white/60 text-[10px] tracking-wider uppercase">Regulatory Anchor</span>
              </div>
            </div>
            <div className="p-6 border border-gold/10 bg-gold/[0.03]">
              <p className="text-gold/80 text-xs tracking-wider uppercase mb-2">Built Different</p>
              <ul className="space-y-2">
                {[
                  'Mobile-first — not mobile-adapted',
                  'Cross-border by default',
                  'Compliance embedded at inception',
                  'API-first for institutional access',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                    <div className="w-1 h-1 bg-gold/60 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
