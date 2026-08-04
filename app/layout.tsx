import type { Metadata } from 'next';
import './globals.css';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { getAllSettings } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string> = {};
  try { settings = await getAllSettings(); } catch {}
  return {
    title: settings.meta_title || 'ASWIN S | MERN Stack Developer',
    description: settings.meta_description || 'MERN Stack Developer crafting dynamic front-end interfaces and robust back-end solutions',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.toggle('dark',localStorage.getItem('admin_dark')==='true')`,
        }} />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&amp;family=Geist:wght@400;600;700;800&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-body-md overflow-x-hidden">
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
