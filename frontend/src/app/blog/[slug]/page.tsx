'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Heart, Tag, User, MapPin, Briefcase, DollarSign, Upload, Send, X, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function ApplicationForm({ article, onClose }: { article: any; onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', message: '', portfolio: '', linkedin: '',
    skills: '', education: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) { toast.error('Veuillez joindre votre CV'); return; }
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error('Les champs obligatoires (*) sont requis');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('jobId', String(article.id));
      formData.append('jobPosition', article.jobPosition || '');
      formData.append('jobType', article.jobType || 'emploi');
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('coverLetter', form.message);
      formData.append('portfolio', form.portfolio);
      formData.append('linkedin', form.linkedin);
      formData.append('skills', form.skills || '');
      formData.append('education', form.education || '');
      formData.append('cv', cvFile);

      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        body: formData,
        
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(err.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      toast.success('Candidature envoyée avec succès !', { icon: '🎉' });
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--fg)' }}>
            Candidature envoyée !
          </h3>
          <p className="mb-8" style={{ color: 'var(--fg-muted)' }}>
            Merci <strong>{form.firstName}</strong> ! Nous avons bien reçu votre candidature pour le poste de{' '}
            <strong>{article.jobPosition}</strong>. Nous vous répondrons sous 5 jours ouvrés.
          </p>
          <button onClick={onClose} className="btn btn-primary w-full justify-center">
            Fermer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
      >
        
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[var(--border)]" style={{ background: 'var(--card-bg)' }}>
          <div>
            <h3 className="font-display font-bold text-xl" style={{ color: 'var(--fg)' }}>
              Postuler — {article.jobPosition}
            </h3>
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>{article.jobLocation}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-2)]" style={{ color: 'var(--fg-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Prénom *</label>
              <input
                required
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
                placeholder="Youssef"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Nom *</label>
              <input
                required
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
                placeholder="Benali"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Téléphone</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
                placeholder="+212 6XX XXX XXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>LinkedIn</label>
              <input
                value={form.linkedin}
                onChange={e => setForm({ ...form, linkedin: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
                placeholder="linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Portfolio</label>
              <input
                value={form.portfolio}
                onChange={e => setForm({ ...form, portfolio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ color: 'var(--fg)' }}
                placeholder="github.com/..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>CV (PDF) *</label>
            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              cvFile
                ? 'border-emerald-500 bg-emerald-500/5'
                : 'border-[var(--border)] hover:border-brand-500 hover:bg-brand-500/5'
            }`}>
              <Upload className={`w-5 h-5 flex-shrink-0 ${cvFile ? 'text-emerald-500' : 'text-brand-500'}`} />
              <div className="flex-1 min-w-0">
                {cvFile ? (
                  <div>
                    <p className="text-sm font-medium text-emerald-500 truncate">{cvFile.name}</p>
                    <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Cliquez pour uploader votre CV</p>
                    <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>PDF uniquement, max 5 MB</p>
                  </div>
                )}
              </div>
              {cvFile && (
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); setCvFile(null); }}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-red-400 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.error('Le fichier dépasse 5 MB');
                    return;
                  }
                  setCvFile(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Lettre de motivation</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              style={{ color: 'var(--fg)' }}
              placeholder="Parlez-nous de vous et de votre motivation..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center text-base py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              <>Envoyer ma candidature <Send className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    fetch(`${API_URL}/api/articles/${slug}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => { if (data) setArticle(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (article && typeof window !== 'undefined' && window.location.hash === '#apply' && article.type === 'job') {
      setShowApply(true);
    }
  }, [article]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl mb-4" style={{ color: 'var(--fg)' }}>Article introuvable</h1>
          <Link href="/blog" className="btn btn-primary">Retour au blog</Link>
        </div>
      </div>
    );
  }

  const tags = Array.isArray(article.tags)
    ? article.tags
    : (typeof article.tags === 'string' ? JSON.parse(article.tags || '[]') : []);

  const isJob = article.type === 'job';

  return (
    <div className="pt-16">
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src={article.imageUrl || 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80'}
          alt={article.imageAlt || article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))' }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((t: string) => (
              <span key={t} className="badge badge-primary text-[10px]">{t}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-2xl md:text-4xl text-white">{article.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            {article.author?.avatar && (
              <img src={article.author.avatar} alt={article.author.name} className="w-10 h-10 rounded-xl object-cover" />
            )}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{article.author?.name || 'Admin'}</p>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>{article.author?.role || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm ml-auto" style={{ color: 'var(--fg-muted)' }}>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime || 5} min</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {(article.views || 0).toLocaleString()}</span>
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
              {(article.likes || 0) + (liked ? 1 : 0)}
            </button>
          </div>
        </div>

        {isJob && article.jobPosition && (
          <div id="apply" className="card p-6 mb-8" style={{ borderColor: 'rgba(79,70,229,0.3)', background: 'rgba(79,70,229,0.05)' }}>
            <div className="flex flex-wrap gap-4 mb-5">
              {article.jobLocation && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-muted)' }}>
                  <MapPin className="w-4 h-4 text-brand-500" />
                  {article.jobLocation}
                </div>
              )}
              {article.jobType && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-muted)' }}>
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  {article.jobType === 'full-time' ? 'Temps plein' : article.jobType}
                </div>
              )}
              {article.jobSalaryMin && article.jobSalaryMax && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-muted)' }}>
                  <DollarSign className="w-4 h-4 text-brand-500" />
                  {Number(article.jobSalaryMin).toLocaleString()} – {Number(article.jobSalaryMax).toLocaleString()} {article.jobSalaryCurrency || 'MAD'}/mois
                </div>
              )}
            </div>
            <button onClick={() => setShowApply(true)} className="btn btn-primary">
              Postuler maintenant <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{
            __html: (article.content || '')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
              .replace(/`(.+?)`/g, '<code>$1</code>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(?!<)/gm, '')
              .replace(/^(.+)$/gm, (match: string) => {
                if (match.startsWith('<')) return match;
                return `<p>${match}</p>`;
              }),
          }}
        />
      </div>

      <AnimatePresence>
        {showApply && (
          <ApplicationForm article={article} onClose={() => setShowApply(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}