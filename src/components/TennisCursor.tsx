'use client';

import { useEffect, useRef } from 'react';

export function TennisCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isVisible = useRef(false);
  const isPressed = useRef(false);
  const isInteractive = useRef(false);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) {
      return;
    }

    const root = document.documentElement;
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    root.classList.add('tennis-cursor-active');

    const animate = () => {
      currentX.current += (targetX.current - currentX.current) * 0.18;
      currentY.current += (targetY.current - currentY.current) * 0.18;

      const scale = isPressed.current ? 0.9 : isInteractive.current ? 1.12 : 1;
      const opacity = isVisible.current ? 1 : 0;

      cursor.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0) translate(-50%, -50%) scale(${scale})`;
      cursor.style.opacity = String(opacity);
      cursor.classList.toggle('tennis-cursor-spin', isInteractive.current);

      animationFrame.current = window.requestAnimationFrame(animate);
    };

    const onMouseMove = (event: MouseEvent) => {
      targetX.current = event.clientX;
      targetY.current = event.clientY;

      if (!isVisible.current) {
        currentX.current = event.clientX;
        currentY.current = event.clientY;
      }

      isVisible.current = true;
    };

    const onMouseDown = () => {
      isPressed.current = true;
    };

    const onMouseUp = () => {
      isPressed.current = false;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        isInteractive.current = false;
        return;
      }

      isInteractive.current = Boolean(
        target.closest('a, button, input, textarea, select, label, [role="button"], [data-cursor="interactive"]'),
      );
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseout', onMouseLeave);
    window.addEventListener('pointerover', onPointerOver);

    animationFrame.current = window.requestAnimationFrame(animate);

    return () => {
      root.classList.remove('tennis-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseout', onMouseLeave);
      window.removeEventListener('pointerover', onPointerOver);
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[99999] h-8 w-8 opacity-0 transition-[opacity] duration-200"
    >
      <img
        src="/assests/tennis-ball.png"
        alt=""
        className="h-full w-full object-contain"
      />
    </div>
  );
}
