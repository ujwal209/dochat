import { ClerkProvider } from '@clerk/nextjs';
import { Outfit } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DocsChat - AI Powered Document Assistant',
  description: 'Chat with your documents using advanced AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased bg-slate-950 text-slate-100`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}