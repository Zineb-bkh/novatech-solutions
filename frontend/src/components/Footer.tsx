'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Zap, Twitter, Linkedin, Github, Instagram, ArrowRight, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { COMPANY } from '@/lib/data';

const LINKS = {
  company: [
    { label: 'À propos', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Développement Web', href: '/services#web' },
    { label: 'Développement Mobile', href: '/services#mobile' },
    { label: 'IA & Data', href: '/services#ai' },
    { label: 'Cloud & DevOps', href: '/services#cloud' },
    { label: 'Cybersécurité', href: '/services#security' },
  ],
  legal: [
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'CGU', href: '#' },
  ],
};

const SOCIALS = [
  { icon: Twitter, href: COMPANY.social.twitter, label: 'Twitter' },
  { icon: Linkedin, href: COMPANY.social.linkedin, label: 'LinkedIn' },
  { icon: Github, href: COMPANY.social.github, label: 'GitHub' },
  { icon: Instagram, href: COMPANY.social.instagram, label: 'Instagram' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Ne pas afficher le footer dans l'espace admin
  if (pathname?.startsWith('/admin')) return null;

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/newsletter`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      if (data.message === 'Already subscribed') {
        toast('Vous êtes déjà abonné(e) à notre newsletter.', { icon: '' });
      } else {
        toast.success('Merci ! Vous êtes abonné(e) à notre newsletter.', { icon: '' });
      }
      setEmail('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
      
      <div className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
                Restez à la pointe
              </h3>
              <p style={{ color: 'var(--fg-muted)' }} className="text-sm">
                Articles tech, offres d'emploi et actualités NovaTech — directement dans votre boîte mail.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  style={{ color: 'var(--fg)' }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary whitespace-nowrap"
              >
                {loading ? '...' : <>S'abonner <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--fg)' }}>
                Nova<span className="gradient-text">Tech</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--fg-muted)' }}>
              {COMPANY.description}
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-all"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-5" style={{ color: 'var(--fg)' }}>
              Entreprise
            </h4>
            <ul className="space-y-3">
              {LINKS.company.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-brand-500 transition-colors" style={{ color: 'var(--fg-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-5" style={{ color: 'var(--fg)' }}>
              Services
            </h4>
            <ul className="space-y-3">
              {LINKS.services.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-brand-500 transition-colors" style={{ color: 'var(--fg-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-5" style={{ color: 'var(--fg)' }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--fg-muted)' }}>
              <li>{COMPANY.email}</li>
              <li>{COMPANY.phone}</li>
              <li className="leading-relaxed">{COMPANY.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            © {new Date().getFullYear()} NovaTech Solutions. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {LINKS.legal.map(l => (
              <Link key={l.href} href={l.href} className="text-xs hover:text-brand-500 transition-colors" style={{ color: 'var(--fg-muted)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}