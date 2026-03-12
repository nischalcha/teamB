'use client';

import { useEffect, useRef, useState } from 'react';

interface ParallaxImageColumnProps {
  src: string;
  alt: string;
  className?: string;
  /** Movement factor (e.g. 0.15 = subtle). Default 0.2 */
  speed?: number;
}

export function ParallaxImageColumn({
  src,
  alt,
  className = '',
  speed = 0.2,
}: ParallaxImageColumnProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !wrapperRef.current || !imgRef.current) return;

    const wrapper = wrapperRef.current;
    const img = imgRef.current;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = sectionCenter - viewportCenter;
      const offset = distance * speed;
      img.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [mounted, speed]);

  return (
    <div
      ref={wrapperRef}
      className={`relative h-[300px] overflow-hidden md:h-[600px] ${className}`}
      role="img"
      aria-label={alt}
    >
      <div
        ref={imgRef}
        className="absolute inset-0 h-[120%] w-full -top-[10%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${src}')` }}
      />
    </div>
  );
}
