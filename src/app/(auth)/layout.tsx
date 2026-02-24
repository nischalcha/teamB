import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../(frontend)/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

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
      <body className={`${geistSans.variable} flex min-h-screen items-center justify-center bg-zinc-50 font-sans antialiased dark:bg-zinc-950`}>
        {children}
      </body>
    </html>
  );
}
