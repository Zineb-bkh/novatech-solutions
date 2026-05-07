'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Briefcase, FolderKanban,
  Users, Settings, LogOut, Menu, X, Zap, Bell,
  ChevronRight, Moon, Sun, GraduationCap
} from 'lucide-react';
import { useTheme } from 'next-themes';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const NAV = [
  { label: 'Dashboard',       href: '/admin',              icon: LayoutDashboard },
  { label: 'Articles',        href: '/admin/articles',     icon: FileText },
  { label: "Offres d'emploi", href: '/admin/jobs',         icon: Briefcase },
  { label: 'Offres de stage', href: '/admin/internships',  icon: GraduationCap },
  { label: 'Portfolio',       href: '/admin/portfolio',    icon: FolderKanban },
  { label: 'Candidatures',    href: '/admin/applications', icon: Users },
  { label: 'Paramètres',      href: '/admin/settings',     icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed]           = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [loginError, setLoginError]   = useState('');
  const [loading, setLoading]         = useState(false);
  const pathname                      = usePathname();
  const { theme, setTheme }           = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('novatech_token');
    if (token) setAuthed(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Identifiants incorrects');
        return;
      }

      localStorage.setItem('novatech_token', data.token);
      localStorage.setItem('novatech_user', JSON.stringify(data.user));
      setAuthed(true);

    } catch (err) {
      setLoginError('Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('novatech_token');
    localStorage.removeItem('novatech_user');
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-10 w-full max-w-md relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl" style={{ color: 'var(--fg)' }}>NovaTech Admin</h1>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Espace d'administration sécurisé</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@novatech.ma"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Mot de passe</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
              />
            </div>

            {loginError && (
              <div className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--fg-muted)' }}>
            admin@novatech.ma / Admin123!
          </p>
        </motion.div>
      </div>
    );
  }

  const currentNav = NAV.find(n => n.href === pathname);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      
      <aside
        className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-[var(--border)] transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}
        style={{ background: 'var(--bg-2)' }}
      >
        
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] h-16">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-base gradient-text">NovaTech</span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'hover:bg-[var(--bg)] hover:text-[var(--fg)]'
                }`}
                style={!active ? { color: 'var(--fg-muted)' } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-1">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium transition-all hover:bg-[var(--bg)]"
            style={{ color: 'var(--fg-muted)' }}
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 flex-shrink-0" />
              : <Moon className="w-4 h-4 flex-shrink-0" />}
            {sidebarOpen && <span>Thème</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] sticky top-0 z-20"
          style={{ background: 'var(--bg-2)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg)] transition-all"
              style={{ color: 'var(--fg-muted)' }}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: 'var(--fg)' }}>{currentNav?.label || 'Dashboard'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg hover:bg-[var(--bg)] transition-all"
              style={{ color: 'var(--fg-muted)' }}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}