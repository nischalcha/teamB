import type { Metadata } from 'next';
import '../(frontend)/globals.css';
import { TennisCursor } from '@/components/TennisCursor';

export const metadata: Metadata = {
  title: 'Flash Sports Academy',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-black/5 antialiased">
        <TennisCursor />
        {children}
      </body>
    </html>
  );
}
