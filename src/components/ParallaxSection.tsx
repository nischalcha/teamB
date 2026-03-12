'use client';

import { useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Background image URL for the parallax layer */
  backgroundImage?: string;
  /** How much the background moves relative to scroll (0.2 = slow, 0.5 = medium). Default 0.35 */
  speed?: number;
  /** Optional overlay (e.g. gradient) rendered above the parallax layer */
  overlay?: React.ReactNode;
}

export function ParallaxSection({
  children,
  className = '',
  backgroundImage,
  speed = 0.35,
  overlay,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current || !bgRef.current || !backgroundImage) return;

    const section = sectionRef.current;
    const bg = bgRef.current;

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distance = sectionCenter - viewportCenter;
      const offset = distance * speed;
      bg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.1)`;
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);

    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, [mounted, backgroundImage, speed]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <>
          <div
            ref={bgRef}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              minHeight: '120%',
              top: '-10%',
            }}
          />
          {overlay && <div className="absolute inset-0 z-10">{overlay}</div>}
        </>
      )}
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}
