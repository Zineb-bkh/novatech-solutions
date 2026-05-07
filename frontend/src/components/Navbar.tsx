'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, Globe, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg" style={{ color: 'var(--fg)' }}>
                Nova<span className="gradient-text">Tech</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? 'text-brand-500 bg-brand-500/10'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-2)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] text-[var(--fg-muted)] cursor-default select-none">
                <Globe className="w-3.5 h-3.5" />
                FR
              </div>

              <button
                onClick={() => mounted && setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[var(--bg-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-all"
                aria-label="Changer le thème"
              >
                {mounted ? (
                  theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <Link
                href="/contact"
                className="hidden sm:inline-flex btn btn-primary text-sm py-2 px-4"
              >
                Devis gratuit
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-2)] text-[var(--fg-muted)]"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[var(--bg)] border-b border-[var(--border)] shadow-xl md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? 'text-brand-500 bg-brand-500/10'
                      : 'text-[var(--fg-muted)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary mt-2 justify-center"
              >
                Devis gratuit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}