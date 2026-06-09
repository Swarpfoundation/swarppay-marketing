import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroActions = [
  {
    title: 'Buy Gift Cards',
    label: 'For customers',
    href: 'https://giftcard.swarppay.com/',
  },
  {
    title: 'Start Selling',
    label: 'For merchants & resellers',
    href: 'https://merchant.swarppay.com/',
  },
  {
    title: 'Partner Dashboard',
    label: 'For approved partners',
    href: 'https://master.swarppay.com/',
  },
];

const LogoMark = () => (
  <img
    src="/swarp-logo.png"
    alt=""
    className="h-full w-full object-contain"
    draggable={false}
  />
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
            Africa&apos;s
            <br />
            Payments
            <br />
            <span className="text-gradient-gold">Layer</span>
          </h1>
          <p className="mt-8 text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
            Built in Morocco. Designed for continental scale. A unified platform enabling consumer payments,
            merchant acceptance, and partner distribution workflows across African markets.
          </p>
          <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {heroActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-gold/30 bg-gold/[0.06] px-5 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-black"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/70 transition-colors group-hover:text-black/60">
                  {action.label}
                </span>
                <span className="mt-1 flex items-center justify-between gap-3 text-sm font-semibold text-white transition-colors group-hover:text-black">
                  {action.title}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    -&gt;
                  </span>
                </span>
              </a>
            ))}
          </div>
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
              <div className="w-16 h-16 md:w-20 md:h-20 opacity-50">
                <LogoMark />
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
