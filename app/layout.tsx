import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'OtoSocial | Autonomous AI Poster',
  description: 'Mission Control for the 24/7 autonomous tech poster',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-[#f5f5f4] text-[#0a0a0a] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
