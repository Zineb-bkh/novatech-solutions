'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card-bg)',
            color: 'var(--fg)',
            border: '1px solid var(--border)',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
    </ThemeProvider>
  );
}
