import type { Metadata } from 'next';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | NovaTech Solutions',
    default: 'NovaTech Solutions — Transforming Digital Vision Into Reality',
  },
  description: 'NovaTech Solutions delivers cutting-edge software development, AI, cloud computing, and cybersecurity services for ambitious businesses.',
  keywords: ['software development', 'AI', 'cloud computing', 'cybersecurity', 'web development', 'mobile apps'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://novatech.solutions',
    siteName: 'NovaTech Solutions',
    title: 'NovaTech Solutions',
    description: 'Cutting-edge software solutions powered by AI and cloud computing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaTech Solutions',
    description: 'Cutting-edge software solutions powered by AI and cloud computing.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="noise">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
