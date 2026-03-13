import type { Metadata } from 'next';
import { ChatBubble } from '@/components/ChatBubble';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { TennisCursor } from '@/components/TennisCursor';
import { getCurrentUser } from '@/lib/auth';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Flash Sports Academy',
  description:
    "Nepal's premier tennis training academy with locations in Baluwatar and Budhanilkantha.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (e) {
    console.error('Auth failed in layout:', e);
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <TennisCursor />
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBubble user={user} />
      </body>
    </html>
  );
}
