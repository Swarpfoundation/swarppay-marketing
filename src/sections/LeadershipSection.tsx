import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticElement } from '@/components/MagneticElement';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    initials: 'SE',
    name: 'Salah Eddine Maniar',
    role: 'Founder & CEO',
    bio: 'Multiple successful exits. Several companies under management. Strong network across Africa and institutional markets.',
    linkedin: 'salah-eddine-maniar',
  },
  {
    initials: 'DD',
    name: 'David Dobrovitsky',
    role: 'General Manager',
    bio: '10 years C-suite across blockchain, fintech, and financial services. Scaling strategic execution in regulated markets.',
    linkedin: 'david-dobrovitsky',
  },
  {
    initials: 'EL',
    name: 'Eleonora Landi',
    role: 'Head of Compliance',
    bio: 'Deep expertise in compliance, governance, and regulatory controls. Builds the institutional trust architecture partners require.',
    linkedin: 'eleonora-landi-6378b62b4',
  },
  {
    initials: 'BL',
    name: 'Barbara Lang, PhD',
    role: 'Advisor',
    bio: 'Managing Partner, InnoExc GmbH (Zurich). Ex-CEO Switzerland, Celerant Consulting. IBM. Blockchain & DLT advisory.',
    linkedin: '',
  },
];

export function LeadershipSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

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

      const memberCards = teamRef.current?.querySelectorAll('.team-card');
      if (memberCards) {
        gsap.fromTo(
          memberCards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: teamRef.current,
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
      id="leadership"
      className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-28">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Leadership
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-4xl">
            Experienced Team.
            <br />
            <span className="text-gradient-gold">Regulated Market.</span>
          </h2>
        </div>

        <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {team.map((member) => (
            <MagneticElement key={member.name} intensity={0.15} className="team-card">
              <div className="group relative p-8 lg:p-10 border border-white/5 hover:border-gold/20 bg-black/30 hover:bg-black/50 transition-all duration-500">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/10 group-hover:border-gold/30 transition-colors">
                    <span className="text-2xl lg:text-3xl font-bold text-gold/60 group-hover:text-gold transition-colors">
                      {member.initials}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-gold transition-colors mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gold/60 text-xs tracking-wider uppercase mb-4">{member.role}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{member.bio}</p>

                    {member.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${member.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-white/30 hover:text-gold text-xs tracking-wider uppercase transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-0 h-px bg-gold/40 group-hover:w-full transition-all duration-700" />
              </div>
            </MagneticElement>
          ))}
        </div>
      </div>
    </section>
  );
}
