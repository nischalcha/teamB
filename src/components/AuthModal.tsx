'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="relative mx-4 w-full max-w-md animate-[modalIn_0.25s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Decorative top bar */}
        <div className="h-1.5 w-full bg-primary" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Icon */}
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <h3 className="font-heading text-xl font-bold uppercase italic tracking-tight text-black">
            Sign In Required
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-black/60">
            You need to be signed in to join a program or book a court. Create an account or sign in to get started.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary hover:text-black"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex h-12 w-full items-center justify-center rounded-full border-2 border-black/15 text-sm font-semibold text-black transition-colors hover:border-primary hover:bg-primary/5"
            >
              Create Account
            </Link>
          </div>

          <p className="mt-5 text-xs text-black/40">
            It only takes a minute to get started.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
