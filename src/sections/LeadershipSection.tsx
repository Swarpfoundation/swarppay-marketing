import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const team = [
  { initials: 'SM', name: 'Salah Eddine Maniar', role: 'Founder & CEO', bio: 'Founder leading SWARP across product, partnerships, and Morocco market access.', image: '/team/salah.png' },
  { initials: 'SM', name: 'Steve Mancini', role: 'Cofounder', bio: 'Cofounder supporting business development, partnerships, and expansion strategy.', image: '/team/steve.png' },
  { initials: 'DD', name: 'David Dobrovitsky', role: 'General Manager', bio: 'General Manager focused on operations, growth, and commercial execution.', image: '/team/david.jpg' },
  { initials: 'DM', name: 'Devon Martens', role: 'CTO', bio: 'CTO responsible for platform architecture, product delivery, and technical execution.', image: '/team/devon.jpg' },
  { initials: 'GB', name: 'Gorkhmaz Beydullayev', role: 'COO', bio: 'COO supporting operations, systems, and partner implementation.', image: '/team/gorkhmaz.png' },
  { initials: 'EL', name: 'Eleonora Landi', role: 'Head of Compliance', bio: 'Head of Compliance supporting governance, process, and partner readiness.', image: '/team/eleonora.jpg' },
  { initials: 'AF', name: 'Angelo Formisano', role: 'Head of Marketing', bio: 'Head of Marketing focused on brand, campaigns, and market communication.', image: '/team/angelo.png' },
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
            duration: 0.7,
            stagger: 0.08,
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
      className="relative w-full py-28 px-6 lg:px-16 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Team
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight max-w-4xl">
            The team
            <br />
            <span className="text-gradient-gold">behind SWARP</span>
          </h2>
        </div>

        <div ref={teamRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="team-card group overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.04]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5 bg-gold/[0.04]">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-center grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-5xl font-bold text-gold/60">{member.initials}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold/60">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/45">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
