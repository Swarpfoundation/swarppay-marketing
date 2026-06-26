import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { safeMailtoHref } from '@/lib/security';

gsap.registerPlugin(ScrollTrigger);

const heroActions = [
  {
    title: 'Buy Gift Cards',
    label: 'For customers',
    href: 'https://giftcard.swarppay.com/',
  },
  {
    title: 'Sell as a Merchant',
    label: 'For merchants & resellers',
    href: 'https://merchant.swarppay.com/',
  },
  {
    title: 'Open Dashboard',
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

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!emailIsValid || normalizedEmail.length > 254) {
      setStatus('');
      setError('Enter a valid email address.');
      return;
    }

    const mailtoHref = safeMailtoHref('info@swarppay.com', {
      subject: 'SwarpPay newsletter and early access',
      body: `Hi SwarpPay team,\n\nPlease add me to the newsletter and early access list.\n\nEmail: ${normalizedEmail}\n\nThanks.`,
    });

    setError('');
    setStatus('Opening your email client to confirm the request.');
    window.location.assign(mailtoHref);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 max-w-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-md sm:flex sm:items-center sm:gap-3"
      noValidate
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError('');
            setStatus('');
          }}
          maxLength={254}
          autoComplete="email"
          placeholder="Email for newsletter and early access"
          className="h-12 w-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-gold"
          aria-describedby="newsletter-help newsletter-error newsletter-status"
          aria-invalid={Boolean(error)}
        />
        <p id="newsletter-help" className="mt-2 text-[10px] leading-relaxed text-white/35 sm:hidden">
          Product updates, launch news, and early access.
        </p>
        {error && (
          <p id="newsletter-error" className="mt-2 text-xs text-red-300" role="alert">
            {error}
          </p>
        )}
        {status && (
          <p id="newsletter-status" className="mt-2 text-xs text-gold" role="status">
            {status}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="mt-3 h-12 w-full border border-gold bg-gold px-5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-[#69f2ea] sm:mt-0 sm:w-auto"
      >
        Subscribe
      </button>
    </form>
  );
}

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
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      tl.to(headlineRef.current, {
        y: -120,
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
      className="relative w-full min-h-[860px] h-screen overflow-hidden bg-black"
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
      <div className="relative z-10 h-full flex flex-col justify-center px-6 pb-20 pt-28 sm:px-8 lg:px-16 lg:pb-24 lg:pt-32">
        <div ref={headlineRef} className="max-w-5xl">
          <p className="text-gold text-[10px] md:text-xs font-semibold tracking-[0.28em] uppercase mb-5">
            Morocco &middot; Africa &middot; Scale
          </p>
          <h1 className="max-w-5xl text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.6rem]">
            Buy, sell, and distribute{' '}
            <span className="text-gradient-gold">digital products in Morocco.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base lg:text-lg">
            SwarpPay connects customers, merchants, and resellers through one platform for
            gift cards, telecom top-ups, gaming vouchers, streaming cards, and prepaid
            digital products.
          </p>
          <div className="mt-7 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {heroActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-gold/30 bg-gold/[0.06] px-4 py-3.5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-black"
              >
                <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-gold/70 transition-colors group-hover:text-black/60">
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
          <p className="mt-4 max-w-3xl text-[10px] tracking-[0.14em] uppercase text-white/35 sm:text-xs">
            Built for consumers, retailers, resellers, and distribution partners.
          </p>
          <NewsletterSignup />
        </div>
      </div>

      {/* Marquee */}
      <div
        ref={marqueeRef}
        className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden py-4"
        style={{ opacity: 0 }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <div className="w-12 h-12 md:w-16 md:h-16 opacity-50">
                <LogoMark />
              </div>
              <span className="text-gold/40 text-base md:text-lg font-light tracking-[0.2em] uppercase whitespace-nowrap">
                SwarpPay
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden flex-col items-center gap-2 md:flex">
        <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
