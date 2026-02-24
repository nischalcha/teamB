import type { Metadata } from 'next';
import '../(frontend)/globals.css';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PortalNav } from '@/components/PortalNav';
import { TennisCursor } from '@/components/TennisCursor';

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
      <body className="flex min-h-screen antialiased">
        <TennisCursor />
        <PortalNav user={user} role="admin" />
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
