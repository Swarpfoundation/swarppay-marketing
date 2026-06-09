import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Product', href: '#solution' },
  { label: 'Market', href: '#market' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Invest', href: '#cta' },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
      style={{ mixBlendMode: scrolled ? 'normal' : 'difference' }}
    >
      <div className="w-full px-6 lg:px-12 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-white">
          <img
            src="/swarp-logo.png"
            alt="SwarpPay logo"
            className="h-9 w-9 object-contain"
            draggable={false}
          />
          <span>
            Swarp<span className="text-gold">Pay</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm font-medium text-white/90 hover:text-gold transition-colors duration-300 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#cta"
          onClick={(e) => handleClick(e, '#cta')}
          className="text-xs font-semibold tracking-widest uppercase px-5 py-2.5 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all duration-300"
        >
          Invest
        </a>
      </div>
    </nav>
  );
}
