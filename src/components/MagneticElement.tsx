import { useRef, useCallback, type ReactNode } from 'react';

interface MagneticElementProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export function MagneticElement({ children, intensity = 0.3, className = '' }: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = Math.floor((centerX - x) * intensity);
    const deltaY = Math.floor((centerY - y) * intensity);
    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = 'none';
    }, 500);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'none' }}
    >
      {children}
    </div>
  );
}
