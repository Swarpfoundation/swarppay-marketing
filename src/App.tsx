import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/hooks/useLenis';
import { Navigation } from '@/sections/Navigation';
import { HeroSection } from '@/sections/HeroSection';
import { ProblemSection } from '@/sections/ProblemSection';
import { SolutionSection } from '@/sections/SolutionSection';
import { MarketSection } from '@/sections/MarketSection';
import { RevenueSection } from '@/sections/RevenueSection';
import { ExpansionSection } from '@/sections/ExpansionSection';
import { LeadershipSection } from '@/sections/LeadershipSection';
import { CTASection } from '@/sections/CTASection';
import { Footer } from '@/sections/Footer';
import { CookieBanner } from '@/components/CookieBanner';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useLenis();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    // Global reveal animation for sections
    const sections = mainRef.current.querySelectorAll('.reveal-on-scroll');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <Navigation />
      <main ref={mainRef} className="bg-black min-h-screen">
        <HeroSection />
        <SolutionSection />
        <ProblemSection />
        <MarketSection />
        <RevenueSection />
        <ExpansionSection />
        <LeadershipSection />
        <CTASection />
        <Footer />
      </main>
      <CookieBanner />
    </>
  );
}

export default App;
