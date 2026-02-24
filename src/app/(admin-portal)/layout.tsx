import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../(frontend)/globals.css';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PortalNav } from '@/components/PortalNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Portal | Flash Sports Academy',
};

export default async function AdminPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} flex min-h-screen font-sans antialiased`}>
        <PortalNav user={user} role="admin" />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
