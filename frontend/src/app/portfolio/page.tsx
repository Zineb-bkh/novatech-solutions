'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, Loader2, ImageIcon } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDesc?: string;
  image?: string;
  technologies: string[];
  results: string[];
  demo?: string;
  featured: boolean;
  published: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATS = [
  { label: 'Tous', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'IA & Data', value: 'ai' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Sécurité', value: 'security' },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        if (!res.ok) throw new Error('Erreur serveur');
        const data = await res.json();
        // API may return array directly or { projects: [...] }
        setProjects(Array.isArray(data) ? data : data.projects ?? []);
      } catch {
        // fallback: empty list, do not crash
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = projects.filter(p => cat === 'all' || p.category === cat);

  return (
    <div className="pt-16">
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="badge badge-primary mb-6">Portfolio</span>
          <h1 className="font-display font-bold text-5xl md:text-6xl mb-4" style={{ color: 'var(--fg)' }}>
            Nos <span className="gradient-text">réalisations</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
            500+ projets livrés. Voici une sélection de ceux dont nous sommes le plus fiers.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {CATS.map(c => (
              <button
                key={c.value}
                onClick={() => setCat(c.value)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  cat === c.value
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'border border-[var(--border)] hover:border-brand-500 hover:text-brand-500'
                }`}
                style={{ color: cat === c.value ? undefined : 'var(--fg-muted)' }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--fg-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Chargement des projets...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4"></p>
              <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--fg)' }}>
                Aucun projet dans cette catégorie
              </p>
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                Revenez bientôt, nous ajoutons régulièrement de nouveaux projets.
              </p>
            </div>
          ) : (
           
            <AnimatePresence mode="wait">
              <motion.div
                key={cat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="card overflow-hidden group cursor-pointer"
                    onClick={() => setSelected(project)}
                  >
                    <div className="relative h-52 overflow-hidden" style={{ background: 'var(--bg-2)' }}>
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12" style={{ color: 'var(--fg-muted)', opacity: 0.3 }} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="badge badge-primary capitalize text-[10px] mb-2 block w-fit">
                          {project.category}
                        </span>
                        <h3 className="font-display font-bold text-white text-base">{project.title}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--fg-muted)' }}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 3).map(t => (
                          <span key={t} className="badge badge-primary text-[10px]">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {project.results.slice(0, 2).map((r, idx) => (
                          <span key={idx} className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative h-56 overflow-hidden rounded-t-2xl flex items-center justify-center"
                style={{ background: 'var(--bg-2)' }}
              >
                {selected.image ? (
                  <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16" style={{ color: 'var(--fg-muted)', opacity: 0.3 }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="badge badge-primary capitalize text-[10px] mb-2 block w-fit">{selected.category}</span>
                  <h2 className="font-display font-bold text-white text-2xl">{selected.title}</h2>
                </div>
              </div>
              <div className="p-8">
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--fg-muted)' }}>
                  {selected.longDesc || selected.description}
                </p>
                {selected.technologies.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--fg)' }}>
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.technologies.map(t => (
                        <span key={t} className="badge badge-primary">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selected.results.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--fg)' }}>
                      Résultats
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {selected.results.map((r, i) => (
                        <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>
                          <div className="text-sm font-bold text-emerald-500">{r}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  {selected.demo && selected.demo !== '#' && (
                    <a href={selected.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 justify-center">
                      Voir la démo <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => setSelected(null)} className="btn btn-outline flex-1 justify-center">
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}