import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M70 20 C40 20, 20 35, 20 50 C20 65, 40 80, 70 80 C55 80, 45 65, 45 50 C45 35, 55 20, 70 20Z" />
    <circle cx="75" cy="22" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headlineRef.current || !marqueeRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.5,
        },
      });

      tl.to(headlineRef.current, {
        y: -200,
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
      }, 0);

      tl.fromTo(
        marqueeRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        0.3
      );

      tl.to(marqueeRef.current, {
        scale: 1.1,
        duration: 1,
        ease: 'none',
      }, 1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let lastScrollY = window.scrollY;
    let rafId: number;

    const updateMarquee = () => {
      const scrollSpeed = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const blur = Math.min(Math.abs(scrollSpeed) * 0.2, 5);
      const yTranslation = (scrollSpeed * 0.15) % 30;
      marquee.style.filter = `blur(${blur}px)`;
      marquee.style.transform = `translateY(${yTranslation}px)`;
      rafId = requestAnimationFrame(updateMarquee);
    };

    rafId = requestAnimationFrame(updateMarquee);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
          style={{ filter: 'brightness(0.4) contrast(1.1)' }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-16 pb-24 lg:pb-32">
        <div ref={headlineRef} className="max-w-4xl">
          <p className="text-gold text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-6">
            Morocco &middot; Africa &middot; Scale
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.9] tracking-tight">
            Africa.
            <br />
            Payments.
            <br />
            <span className="text-gradient-gold">Reimagined.</span>
          </h1>
          <p className="mt-8 text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
            One unified platform. Consumer wallets to enterprise APIs. Built from Morocco — 
            Africa's anchor economy — for the continent's next growth cycle.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div
        ref={marqueeRef}
        className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden py-6"
        style={{ opacity: 0 }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <div className="w-16 h-16 md:w-20 md:h-20 text-gold/40">
                <SLogo />
              </div>
              <span className="text-gold/40 text-lg md:text-xl font-light tracking-[0.2em] uppercase whitespace-nowrap">
                SwarpPay
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
