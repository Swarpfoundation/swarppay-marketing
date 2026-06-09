import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const customerSteps = ['Choose product', 'Pay online', 'Receive digital code', 'Redeem or gift'];
const merchantSteps = ['Apply', 'Get approved', 'Access catalog', 'Sell to customers', 'Track performance'];

export function RevenueSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

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

      const columns = columnsRef.current?.querySelectorAll('.flow-column');
      if (columns) {
        gsap.fromTo(
          columns,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: columnsRef.current,
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
      id="how-it-works"
      className="relative w-full py-28 px-6 lg:px-16 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
            Simple flows for
            <br />
            <span className="text-gradient-gold">customers and merchants.</span>
          </h2>
        </div>

        <div ref={columnsRef} className="grid gap-6 lg:grid-cols-2">
          {[
            { title: 'For customers', steps: customerSteps },
            { title: 'For merchants', steps: merchantSteps },
          ].map((column) => (
            <div key={column.title} className="flow-column border border-white/5 bg-white/[0.02] p-7 lg:p-9">
              <h3 className="mb-8 text-2xl font-semibold text-white">{column.title}</h3>
              <div className="space-y-4">
                {column.steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 border border-white/5 bg-black/30 p-4">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-gold/20 text-xs font-mono text-gold">
                      0{index + 1}
                    </span>
                    <p className="text-sm font-medium text-white/70">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
