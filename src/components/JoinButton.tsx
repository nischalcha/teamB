'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AuthModal } from './AuthModal';

interface JoinButtonProps {
  isLoggedIn: boolean;
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function JoinButton({ isLoggedIn, href, children, className }: JoinButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = useCallback(() => setShowModal(false), []);

  if (isLoggedIn) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={className}
      >
        {children}
      </button>
      <AuthModal open={showModal} onClose={handleClose} />
    </>
  );
}
