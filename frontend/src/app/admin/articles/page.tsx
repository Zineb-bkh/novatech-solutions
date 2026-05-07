'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, Search, X, Save, Loader2,
  Upload, ImageIcon, Clock, Heart, Tag, User, ChevronLeft,
  PenLine, CheckCircle2, MapPin, Briefcase, DollarSign, Send,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: 'blog' | 'news' | 'job';
  category?: string;
  imageUrl?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  views: number;
  likes: number;
  readTime?: number;
  author?: { id: number; name: string; avatar?: string; role?: string };
  createdAt: string;
  jobPosition?: string;
  jobDepartment?: string;
  jobLocation?: string;
  jobType?: string;
  jobSalaryMin?: number;
  jobSalaryMax?: number;
  jobSalaryCurrency?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('novatech_token');
}

async function apiFetch(path: string, options?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Erreur serveur');
  }
  return res.json();
}

const TYPE_COLORS: Record<string, string> = { blog: 'badge-primary', news: 'badge-success', job: 'badge-warning' };
const TYPE_LABELS: Record<string, string> = { blog: 'Article', news: 'Actualité', job: 'Emploi' };

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.3rem;font-weight:700;margin:1.25rem 0 0.5rem;color:var(--fg)">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:600;margin:1rem 0 0.4rem;color:var(--fg)">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #6366f1;padding:0.6rem 1rem;margin:0.75rem 0;color:var(--fg-muted);font-style:italic;background:rgba(99,102,241,0.06);border-radius:0 8px 8px 0">$1</blockquote>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(99,102,241,0.1);color:#6366f1;padding:0.1rem 0.35rem;border-radius:4px;font-size:0.82em">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin:0.6rem 0;line-height:1.75;color:var(--fg-muted)">')
    .replace(/^(?!<)(.+)$/gm, (m) => m.startsWith('<') ? m : `<p style="margin:0.6rem 0;line-height:1.75;color:var(--fg-muted)">${m}</p>`);
}

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml'].includes(file.type)) {
      toast.error('Format non supporté. JPG, PNG, GIF, WEBP ou SVG.'); return;
    }
    if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop volumineux (max 10 Mo)'); return; }
    onChange(URL.createObjectURL(file));
    setUploading(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const data = await res.json();
      onChange(data.url);
      toast.success('Image uploadée !');
    } catch (e: any) {
      toast.error(e.message);
      onChange('');
    } finally { setUploading(false); }
  };

  return (
    <div
      onClick={() => !value && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if(f) uploadFile(f); }}
      className="relative rounded-2xl overflow-hidden border-2 border-dashed transition-all"
      style={{
        height: value ? 200 : 130,
        borderColor: dragOver ? '#6366f1' : 'var(--border)',
        background: value ? 'transparent' : dragOver ? 'rgba(99,102,241,0.07)' : 'var(--bg)',
        cursor: value ? 'default' : 'pointer',
      }}
    >
      {value ? (
        <>
          <img src={value} alt="" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
          )}
          {!uploading && (
            <div className="absolute top-3 right-3 flex gap-2">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: 'rgba(0,0,0,0.6)' }}>
                Changer
              </button>
              <button type="button" onClick={() => onChange('')}
                className="p-1.5 rounded-lg text-white" style={{ background: 'rgba(220,38,38,0.75)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-12"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-2)' }}>
            <Upload className="w-5 h-5" style={{ color: 'var(--fg-muted)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Cliquez ou déposez une image</p>
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>JPG · PNG · GIF · WEBP · SVG — max 10 Mo</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*"
        onChange={e => { const f = e.target.files?.[0]; if(f) uploadFile(f); e.target.value=''; }}
        className="hidden" />
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";
const inputStyle = { color: 'var(--fg)' };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>{label}</label>
      {children}
      {hint && <p className="text-[11px]" style={{ color: 'var(--fg-muted)' }}>{hint}</p>}
    </div>
  );
}

function ArticlePreview({ form }: { form: any }) {
  const readTime = estimateReadTime(form.content || '');
  const tags = (form.tagsRaw || '').split(',').map((t: string) => t.trim()).filter(Boolean);
  const authorName = form.authorName || 'Admin';
  const authorAvatar = form.authorAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=4f46e5&color=fff&size=60`;
  const isJob = form.type === 'job';

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)] text-sm" style={{ background: 'var(--bg)' }}>
      <div className="relative overflow-hidden" style={{ height: 200, background: 'var(--bg-2)' }}>
        {form.imageUrl ? (
          <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2">
            <ImageIcon className="w-8 h-8" style={{ color: 'var(--border)' }} />
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Image de couverture</p>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))' }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.length > 0 ? tags.map((t: string) => (
              <span key={t} className="badge badge-primary text-[10px]">{t}</span>
            )) : <span className="text-[10px] text-white/40">Tags apparaîtront ici</span>}
          </div>
          <h2 className="font-bold text-base text-white leading-snug line-clamp-2">
            {form.title || <span className="opacity-40">Titre...</span>}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
        <img src={authorAvatar} alt={authorName} className="w-9 h-9 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--fg)' }}>{authorName}</p>
          <p className="text-[10px] truncate" style={{ color: 'var(--fg-muted)' }}>{form.authorRole || 'Auteur'}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] shrink-0" style={{ color: 'var(--fg-muted)' }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime} min</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />0</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />0</span>
        </div>
      </div>

      {isJob && (
        <div className="mx-4 mt-4 rounded-xl p-3 border" style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.jobLocation && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
                <MapPin className="w-3 h-3 text-brand-500" />{form.jobLocation}
              </span>
            )}
            {form.jobType && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
                <Briefcase className="w-3 h-3 text-brand-500" />
                {form.jobType === 'full-time' ? 'Temps plein' : form.jobType === 'part-time' ? 'Temps partiel' : form.jobType === 'contract' ? 'Freelance' : 'Remote'}
              </span>
            )}
            {(form.jobSalaryMin || form.jobSalaryMax) && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
                <DollarSign className="w-3 h-3 text-brand-500" />
                {form.jobSalaryMin && Number(form.jobSalaryMin).toLocaleString()}
                {form.jobSalaryMin && form.jobSalaryMax && ' – '}
                {form.jobSalaryMax && Number(form.jobSalaryMax).toLocaleString()}
                {' '}{form.jobSalaryCurrency || 'MAD'}/mois
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-brand-500">
            <Send className="w-3 h-3" /> Postuler maintenant
          </div>
        </div>
      )}

      <div className="px-4 py-4 max-h-64 overflow-y-auto" style={{ color: 'var(--fg-muted)' }}>
        {form.content ? (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }} />
        ) : (
          <p className="text-center py-8 text-xs opacity-30">Le contenu Markdown apparaîtra ici...</p>
        )}
      </div>
    </div>
  );
}

function ArticleEditor({ initial, isNew, onSave, onClose }: {
  initial: Partial<Article>; isNew: boolean;
  onSave: (data: any) => Promise<void>; onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [form, setForm] = useState({
    title:             initial.title || '',
    type:              initial.type || 'blog',
    category:          initial.category || 'technology',
    imageUrl:          initial.imageUrl || '',
    excerpt:           initial.excerpt || '',
    content:           initial.content || '',
    tagsRaw:           (initial.tags || []).join(', '),
    authorName:        (initial.author as any)?.name || '',
    authorRole:        (initial.author as any)?.role || '',
    authorAvatar:      (initial.author as any)?.avatar || '',
    published:         initial.published ?? false,
    jobPosition:       initial.jobPosition || '',
    jobDepartment:     initial.jobDepartment || '',
    jobLocation:       initial.jobLocation || '',
    jobType:           initial.jobType || 'full-time',
    jobSalaryMin:      initial.jobSalaryMin?.toString() || '',
    jobSalaryMax:      initial.jobSalaryMax?.toString() || '',
    jobSalaryCurrency: initial.jobSalaryCurrency || 'MAD',
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const isJob = form.type === 'job';

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Titre et contenu obligatoires'); return; }
    if (isJob && !form.jobPosition) { toast.error("Le poste est obligatoire pour une offre d'emploi"); return; }
    setSaving(true);
    try {
      const payload: any = {
        title:    form.title,
        content:  form.content,
        excerpt:  form.excerpt,
        type:     form.type,
        category: form.category,
        imageUrl: form.imageUrl,
        tags:     form.tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean),
        published: form.published,
        readTime: estimateReadTime(form.content),
      };
      if (isJob) {
        payload.jobPosition       = form.jobPosition;
        payload.jobDepartment     = form.jobDepartment;
        payload.jobLocation       = form.jobLocation;
        payload.jobType           = form.jobType;
        payload.jobSalaryMin      = form.jobSalaryMin ? parseInt(form.jobSalaryMin) : null;
        payload.jobSalaryMax      = form.jobSalaryMax ? parseInt(form.jobSalaryMax) : null;
        payload.jobSalaryCurrency = form.jobSalaryCurrency;
      }
      await onSave(payload);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="w-full flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden"
        style={{ maxWidth: 1000, maxHeight: '93vh', background: 'var(--card-bg, var(--bg))' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-2)] transition-colors" style={{ color: 'var(--fg-muted)' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--fg)' }}>
              {isNew ? (isJob ? "Nouvelle offre d'emploi" : 'Nouvel article') : (isJob ? "Modifier l'offre" : "Modifier l'article")}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl p-0.5 border border-[var(--border)]" style={{ background: 'var(--bg-2)' }}>
              {([['edit', PenLine, 'Éditeur'], ['preview', Eye, 'Aperçu']] as const).map(([key, Icon, label]) => (
                <button key={key} onClick={() => setTab(key as any)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all md:hidden"
                  style={{
                    background: tab === key ? 'var(--bg)' : 'transparent',
                    color: tab === key ? 'var(--fg)' : 'var(--fg-muted)',
                    boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
            <button onClick={onClose} style={{ color: 'var(--fg-muted)' }}><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={`w-full md:w-1/2 overflow-y-auto border-r border-[var(--border)] p-5 space-y-5 ${tab === 'preview' ? 'hidden md:block' : ''}`}>
            <Field label="Image de couverture">
              <ImageUpload value={form.imageUrl} onChange={v => set('imageUrl', v)} />
            </Field>

            <Field label="Tags" hint="Séparés par des virgules — ex : React, Node.js, Fullstack">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                <input value={form.tagsRaw} onChange={e => set('tagsRaw', e.target.value)}
                  className={inputCls + ' pl-9'} style={inputStyle}
                  placeholder={isJob ? "React, Node.js, Fullstack, Senior" : "IA, LLM, Transformation digitale"} />
              </div>
            </Field>

            <Field label="Titre *">
              <textarea rows={2} value={form.title} onChange={e => set('title', e.target.value)}
                className={inputCls + ' resize-none font-bold text-base leading-snug'} style={inputStyle}
                placeholder={isJob ? "Senior Fullstack Developer — React / Node.js" : "L'IA Générative : La Révolution Silencieuse..."} />
            </Field>

            <div className="rounded-xl border border-[var(--border)] p-4 space-y-3" style={{ background: 'var(--bg-2)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>👤 Auteur</p>
              <div className="flex gap-3 items-start">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[var(--border)] cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--bg)' }}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  title="Cliquez pour changer l'avatar">
                  {form.authorAvatar ? (
                    <img src={form.authorAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-0.5">
                      <User className="w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                      <span className="text-[8px]" style={{ color: 'var(--fg-muted)' }}>Photo</span>
                    </div>
                  )}
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]; if(!f) return;
                      const token = getToken();
                      const fd = new FormData(); fd.append('image', f);
                      try {
                        const res = await fetch(`${API_BASE}/api/upload`, {
                          method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd,
                        });
                        const d = await res.json();
                        set('authorAvatar', d.url);
                      } catch { set('authorAvatar', URL.createObjectURL(f)); }
                    }} />
                </div>
                <div className="flex-1 space-y-2">
                  <input value={form.authorName} onChange={e => set('authorName', e.target.value)}
                    className={inputCls} style={inputStyle} placeholder={isJob ? "Sara Idrissi" : "Mehdi Tazi"} />
                  <input value={form.authorRole} onChange={e => set('authorRole', e.target.value)}
                    className={inputCls} style={inputStyle} placeholder={isJob ? "CTO" : "Lead AI Engineer"} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="blog">Article</option>
                  <option value="news">Actualité</option>
                  <option value="job">Offre d'emploi</option>
                </select>
              </Field>
              <Field label="Catégorie">
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="technology">Technologie</option>
                  <option value="company">Entreprise</option>
                  <option value="industry">Industrie</option>
                  <option value="career">Carrière</option>
                </select>
              </Field>
            </div>

            <AnimatePresence>
              {isJob && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border p-4 space-y-4"
                    style={{ borderColor: 'rgba(99,102,241,0.35)', background: 'rgba(99,102,241,0.04)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-brand-500" />
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">
                        Détails de l'offre d'emploi
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Poste *">
                        <input value={form.jobPosition} onChange={e => set('jobPosition', e.target.value)}
                          className={inputCls} style={inputStyle} placeholder="Senior Fullstack Developer" />
                      </Field>
                      <Field label="Département">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                          <input value={form.jobDepartment} onChange={e => set('jobDepartment', e.target.value)}
                            className={inputCls + ' pl-9'} style={inputStyle} placeholder="Engineering" />
                        </div>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Localisation">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                          <input value={form.jobLocation} onChange={e => set('jobLocation', e.target.value)}
                            className={inputCls + ' pl-9'} style={inputStyle} placeholder="Casablanca (Hybride)" />
                        </div>
                      </Field>
                      <Field label="Type de contrat">
                        <select value={form.jobType} onChange={e => set('jobType', e.target.value)} className={inputCls} style={inputStyle}>
                          <option value="full-time">Temps plein</option>
                          <option value="part-time">Temps partiel</option>
                          <option value="contract">Freelance / Contrat</option>
                          <option value="remote">Full Remote</option>
                        </select>
                      </Field>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>
                        Fourchette salariale
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                          <input type="number" value={form.jobSalaryMin} onChange={e => set('jobSalaryMin', e.target.value)}
                            className={inputCls + ' pl-9'} style={inputStyle} placeholder="18000" />
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                          <input type="number" value={form.jobSalaryMax} onChange={e => set('jobSalaryMax', e.target.value)}
                            className={inputCls + ' pl-9'} style={inputStyle} placeholder="25000" />
                        </div>
                        <select value={form.jobSalaryCurrency} onChange={e => set('jobSalaryCurrency', e.target.value)} className={inputCls} style={inputStyle}>
                          <option value="MAD">MAD</option>
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--fg-muted)' }}>
                        Min / Max / Devise — ex : 18 000 – 25 000 MAD/mois
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Field label="Résumé" hint="Affiché dans la liste du blog">
              <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                className={inputCls + ' resize-none'} style={inputStyle}
                placeholder={isJob
                  ? "Nous cherchons un(e) développeur(se) Fullstack senior pour renforcer notre équipe..."
                  : "Comment les LLMs redéfinissent les processus métier, la productivité et l'innovation..."
                } />
            </Field>

            <Field label="Contenu (Markdown) *" hint="## Titre  |  ### Sous-titre  |  **gras**  |  > citation  |  `code`">
              <textarea rows={14} value={form.content} onChange={e => set('content', e.target.value)}
                className={inputCls + ' resize-y font-mono text-xs leading-relaxed'} style={inputStyle}
                placeholder={isJob
                  ? "## À propos du poste\n\nNous cherchons un(e) développeur(se) Fullstack senior...\n\n## Vos responsabilités\n\n- Concevoir et développer des fonctionnalités frontend et backend\n- Participer aux revues de code\n- Collaborer avec les designers\n\n## Profil recherché\n\n- 5+ ans d'expérience en développement web\n- Maîtrise de React, Next.js, TypeScript\n\n## Ce que nous offrons\n\n- Salaire compétitif\n- Télétravail hybride\n- Budget formation annuel"
                  : "## L'IA Générative en 2024 : État des Lieux\n\nL'intelligence artificielle générative a franchi un cap décisif...\n\n### Les cas d'usage qui créent de la valeur réelle\n\n> \"L'IA ne remplace pas les humains.\"\n\n## Conclusion\n\nLes entreprises qui intègrent l'IA générative aujourd'hui..."
                } />
            </Field>

            <label className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:border-brand-500 transition-colors select-none"
              style={{
                borderColor: form.published ? '#6366f1' : 'var(--border)',
                background: form.published ? 'rgba(99,102,241,0.06)' : 'var(--bg-2)',
              }}>
              <div className="relative w-10 h-6 rounded-full transition-colors shrink-0"
                style={{ background: form.published ? '#6366f1' : 'var(--border)' }}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="hidden" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                  {form.published ? 'Publier immédiatement' : 'Sauvegarder comme brouillon'}
                </p>
                <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                  {form.published ? 'Visible sur le blog public' : 'Non visible sur le blog'}
                </p>
              </div>
              {form.published && <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />}
            </label>
          </div>

          <div className={`w-full md:w-1/2 overflow-y-auto p-5 ${tab === 'edit' ? 'hidden md:block' : ''}`}
            style={{ background: 'var(--bg-2)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--fg-muted)' }}>
              Aperçu en temps réel
            </p>
            <ArticlePreview form={form} />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0"
          style={{ background: 'var(--card-bg, var(--bg))' }}>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Sauvegarde...' : (isJob ? "Publier l'offre" : 'Sauvegarder')}
          </button>
          <button onClick={onClose} disabled={saving} className="btn btn-outline px-8">Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'news' | 'blog'>('all');
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/articles');
      setArticles(data.articles ?? data);
    } catch (err: any) {
      toast.error(err.message || 'Impossible de charger les articles');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadArticles(); }, []);

  const filtered = articles.filter(a =>
    (typeFilter === 'all' || a.type === typeFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article définitivement ?')) return;
    try {
      await apiFetch(`/api/articles/${id}`, { method: 'DELETE' });
      setArticles(prev => prev.filter(a => a.id !== id));
      toast.success('Article supprimé');
    } catch (err: any) { toast.error(err.message); }
  };

  const handleSave = async (payload: any) => {
    if (isNew) {
      const created = await apiFetch('/api/articles', { method: 'POST', body: JSON.stringify(payload) });
      setArticles(prev => [created, ...prev]);
      toast.success(payload.type === 'job' ? 'Offre publiée avec succès !' : 'Article créé avec succès !');
    } else {
      const updated = await apiFetch(`/api/articles/${editing!.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setArticles(prev => prev.map(a => a.id === editing!.id ? updated : a));
      toast.success('Mis à jour !');
    }
    setEditing(null);
    setIsNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--fg)' }}>Articles</h1>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            {loading ? '...' : `${filtered.length} contenu${filtered.length > 1 ? 's' : ''}${typeFilter !== 'all' ? ' · filtre actif' : ' au total'}`}
          </p>
        </div>
        <button
          onClick={() => { setEditing({ title: '', excerpt: '', content: '', type: 'blog', tags: [], published: false }); setIsNew(true); }}
          className="btn btn-primary">
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
        <input type="text" placeholder="Rechercher un article..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          style={{ color: 'var(--fg)' }} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {([
          { key: 'all',  label: 'Tout',      emoji: '' },
          { key: 'job',  label: 'Emploi',    emoji: '' },
          { key: 'news', label: 'Actualité', emoji: '' },
          { key: 'blog', label: 'Article',   emoji: '' },
        ] as const).map(({ key, label, emoji }) => {
          const count = key === 'all' ? articles.length : articles.filter(a => a.type === key).length;
          const active = typeFilter === key;
          return (
            <button key={key} onClick={() => setTypeFilter(key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
              style={{
                background: active ? '#6366f1' : 'var(--bg-2)',
                color: active ? '#fff' : 'var(--fg-muted)',
                borderColor: active ? '#6366f1' : 'var(--border)',
                boxShadow: active ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
              }}>
              <span>{emoji}</span>
              <span>{label}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--bg)',
                  color: active ? '#fff' : 'var(--fg-muted)',
                }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden" style={{ padding: 0 }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fg-muted)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3"></p>
            <p className="font-medium" style={{ color: 'var(--fg)' }}>Aucun article trouvé</p>
            <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>Créez votre premier article</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--bg-2)' }}>
              <tr className="text-left">
                {['Titre', 'Type', 'Auteur', 'Date', 'Vues', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(a => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-[var(--bg-2)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {a.imageUrl ? (
                        <img src={a.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-2)' }}>
                          <ImageIcon className="w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-xs line-clamp-2 max-w-[200px]" style={{ color: 'var(--fg)' }}>{a.title}</p>
                        {a.type === 'job' && a.jobPosition && (
                          <p className="text-[10px] text-brand-500 font-medium">{a.jobPosition}</p>
                        )}
                        {!a.published && <span className="text-[10px] text-orange-400 font-medium">Brouillon</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${TYPE_COLORS[a.type] ?? 'badge-primary'} text-[10px]`}>{TYPE_LABELS[a.type] ?? a.type}</span>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--fg-muted)' }}>{a.author?.name ?? 'Admin'}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {format(new Date(a.publishedAt || a.createdAt), 'd MMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium" style={{ color: 'var(--fg)' }}>{(a.views ?? 0).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a href={`/blog/${a.slug}`} target="_blank"
                        className="p-1.5 rounded-lg hover:bg-[var(--bg)] transition-colors" style={{ color: 'var(--fg-muted)' }}>
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <button onClick={() => { setEditing({ ...a, tags: a.tags ?? [] }); setIsNew(false); }}
                        className="p-1.5 rounded-lg hover:bg-brand-500/10 text-brand-500 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(a.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <ArticleEditor
            initial={editing}
            isNew={isNew}
            onSave={handleSave}
            onClose={() => { setEditing(null); setIsNew(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}