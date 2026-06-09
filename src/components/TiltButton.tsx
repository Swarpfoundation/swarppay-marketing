import { useRef, useCallback, type ReactNode } from 'react';

interface TiltButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TiltButton({ children, className = '', onClick }: TiltButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = -((y - centerY) / centerY);
    const maxRotationX = 15;
    const maxRotationY = 15;
    const rotateX = (percentY * maxRotationX).toFixed(2);
    const rotateY = (percentX * maxRotationY).toFixed(2);
    const glossX = Math.floor(((x / rect.width) * 100) - 10);
    const glossY = Math.floor(((y / rect.height) * 100) - 10);
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.background = `radial-gradient(circle at ${glossX}% ${glossY}%, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.05) 50%, rgba(0,0,0,0) 80%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    ref.current.style.background = 'transparent';
    ref.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.6s ease';
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = 'none';
    }, 600);
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{ transition: 'none', willChange: 'transform' }}
    >
      {children}
    </button>
  );
}
