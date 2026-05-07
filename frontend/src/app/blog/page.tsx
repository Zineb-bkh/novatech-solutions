'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Heart, Briefcase, GraduationCap, ArrowRight, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const FILTERS = [
  { label: 'Tout',             value: 'all',   icon: null },
  { label: 'Articles',         value: 'blog',  icon: null },
  { label: 'Actualités',       value: 'news',  icon: null },
  { label: "Offres d'emploi",  value: 'job',   icon: 'briefcase' },
  { label: 'Offres de stage',  value: 'stage', icon: 'graduation' },
];

export default function BlogPage() {
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ limit: '50' });
        if (filter === 'stage') {
          params.set('type', 'job');
          params.set('jobType', 'stage');
        } else if (filter !== 'all') {
          params.set('type', filter);
        }
        if (search) params.set('search', search);

        const res = await fetch(`${API_URL}/api/articles?${params}`);
        if (!res.ok) throw new Error('Erreur lors du chargement des articles');
        const data = await res.json();

        let list = data.articles || [];
        if (filter === 'stage') list = list.filter((a: any) => a.jobType === 'stage');
        if (filter === 'job')   list = list.filter((a: any) => a.jobType !== 'stage');

        setArticles(list);
      } catch (err: any) {
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchArticles, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [filter, search]);

  return (
    <div className="pt-16">
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="badge badge-primary mb-6">Blog & Actualités</span>
          <h1 className="font-display font-bold text-5xl md:text-6xl mb-4" style={{ color: 'var(--fg)' }}>
            Insights & <span className="gradient-text">Opportunités</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
            Articles tech, actualités NovaTech, offres d'emploi et de stage pour les talents du digital.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    filter === f.value
                      ? 'bg-brand-500 text-white shadow-glow'
                      : 'border border-[var(--border)] hover:border-brand-500 hover:text-brand-500'
                  }`}
                  style={{ color: filter === f.value ? undefined : 'var(--fg-muted)' }}
                >
                  {f.icon === 'briefcase'   && <Briefcase    className="w-3.5 h-3.5" />}
                  {f.icon === 'graduation'  && <GraduationCap className="w-3.5 h-3.5" />}
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                style={{ color: 'var(--fg)' }}
              />
            </div>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-48 bg-[var(--border)]" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-[var(--border)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--border)] rounded w-full" />
                    <div className="h-3 bg-[var(--border)] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-24">
              <p className="text-lg text-red-500">{error}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--fg-muted)' }}>
                Vérifiez que le serveur backend est bien démarré sur {API_URL}
              </p>
            </div>
          )}

          {!loading && !error && (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {articles.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {article.type === 'job' && article.jobType === 'stage' ? (
                      <StageCard article={article} />
                    ) : article.type === 'job' ? (
                      <JobCard article={article} />
                    ) : (
                      <ArticleCard article={article} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-24">
              <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>Aucun résultat trouvé.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const TYPE_COLORS: Record<string, string> = {
    blog: 'badge-primary',
    news: 'badge-success',
    job:  'badge-warning',
  };
  const TYPE_LABELS: Record<string, string> = {
    blog: 'Article',
    news: 'Actualité',
    job:  'Emploi',
  };

  const authorName   = article.author?.name || 'Admin';
  const authorAvatar = article.author?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=4f46e5&color=fff&size=60`;

  return (
    <Link href={`/blog/${article.slug}`} className="card overflow-hidden group block h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.imageUrl || 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80'}
          alt={article.imageAlt || article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className={`badge ${TYPE_COLORS[article.type] || 'badge-primary'} absolute bottom-3 left-3 text-[10px]`}>
          {TYPE_LABELS[article.type] || article.type}
        </span>
      </div>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <img src={authorAvatar} alt={authorName} className="w-7 h-7 rounded-full" />
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{authorName}</span>
          {article.readTime && (
            <span className="ml-auto text-xs" style={{ color: 'var(--fg-muted)' }}>
              {article.readTime} min
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base mb-2 group-hover:text-brand-500 transition-colors line-clamp-2" style={{ color: 'var(--fg)' }}>
          {article.title}
        </h3>
        <p className="text-sm line-clamp-2 mb-4 flex-1" style={{ color: 'var(--fg-muted)' }}>
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--fg-muted)' }}>
          <span>
            {article.publishedAt
              ? format(new Date(article.publishedAt), 'd MMM yyyy', { locale: fr })
              : '—'}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {(article.views || 0).toLocaleString()}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.likes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function JobCard({ article }: { article: any }) {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <span className="badge badge-warning flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> Offre d'emploi
        </span>
        <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
          {article.publishedAt
            ? format(new Date(article.publishedAt), 'd MMM yyyy', { locale: fr })
            : '—'}
        </span>
      </div>
      <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--fg)' }}>
        {article.jobPosition || article.title}
      </h3>
      <p className="text-sm mb-4 flex-1" style={{ color: 'var(--fg-muted)' }}>{article.excerpt}</p>

      {article.jobLocation && (
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="badge badge-primary text-[10px] flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" /> {article.jobLocation}
          </span>
          {article.jobType && article.jobType !== 'stage' && (
            <span className="badge badge-primary text-[10px]">
              {article.jobType === 'full-time' ? ' Temps plein'
               : article.jobType === 'remote'  ? ' Remote'
               : article.jobType}
            </span>
          )}
          {article.jobSalaryMin && article.jobSalaryMax && (
            <span className="badge badge-success text-[10px]">
               {article.jobSalaryMin.toLocaleString()} – {article.jobSalaryMax.toLocaleString()} {article.jobSalaryCurrency || 'MAD'}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Link href={`/blog/${article.slug}`} className="btn btn-outline flex-1 justify-center text-sm py-2">
          Voir l'offre
        </Link>
        <Link href={`/blog/${article.slug}#apply`} className="btn btn-primary flex-1 justify-center text-sm py-2">
          Postuler <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function StageCard({ article }: { article: any }) {
  return (
    <div className="card p-6 h-full flex flex-col" style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.03)' }}>
      <div className="flex items-start justify-between mb-4">
        <span className="badge flex items-center gap-1 text-[10px]"
          style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.35)' }}>
          <GraduationCap className="w-3 h-3" /> Offre de stage
        </span>
        <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
          {article.publishedAt
            ? format(new Date(article.publishedAt), 'd MMM yyyy', { locale: fr })
            : '—'}
        </span>
      </div>

      <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--fg)' }}>
        {article.jobPosition || article.title}
      </h3>
      <p className="text-sm mb-4 flex-1" style={{ color: 'var(--fg-muted)' }}>{article.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {article.jobLocation && (
          <span className="badge text-[10px] flex items-center gap-1"
            style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
            <MapPin className="w-2.5 h-2.5" /> {article.jobLocation}
          </span>
        )}
        {article.jobDepartment && (
          <span className="badge text-[10px]"
            style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
            {article.jobDepartment}
          </span>
        )}
        
        <span className="badge badge-success text-[10px] flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {article.stageDuration ? `${article.stageDuration}` : 'Durée à préciser'}
        </span>
      </div>

      <div className="flex gap-2">
        <Link href={`/blog/${article.slug}`} className="btn btn-outline flex-1 justify-center text-sm py-2">
          Voir le stage
        </Link>
        <Link
          href={`/blog/${article.slug}#apply`}
          className="btn flex-1 justify-center text-sm py-2"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white', border: 'none' }}
        >
          Postuler <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}