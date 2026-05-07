'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, Search, X, Save, Loader2,
  Upload, ImageIcon, Clock, Tag, User, ChevronLeft,
  PenLine, CheckCircle2, MapPin, GraduationCap, Send,
  Building2, CalendarDays, BookOpen, DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface InternshipArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: 'job';
  jobType: 'stage';
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
  stageDuration?: string;
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

const INTERNSHIP_TYPE_LABELS: Record<string, string> = {
  paid:       'Stage rémunéré',
  unpaid:     'Stage non rémunéré',
  alternance: 'Alternance',
  pfe:        "PFE (Projet de Fin d'Études)",
};

const INTERNSHIP_LEVEL_LABELS: Record<string, string> = {
  bac2:     'Bac+2',
  bac3:     'Bac+3',
  bac5:     'Bac+5 (Master / Ingénieur)',
  doctorat: 'Doctorat',
  open:     'Tous niveaux',
};

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.3rem;font-weight:700;margin:1.25rem 0 0.5rem;color:var(--fg)">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:600;margin:1rem 0 0.4rem;color:var(--fg)">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #8b5cf6;padding:0.6rem 1rem;margin:0.75rem 0;color:var(--fg-muted);font-style:italic;background:rgba(139,92,246,0.06);border-radius:0 8px 8px 0">$1</blockquote>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(139,92,246,0.1);color:#8b5cf6;padding:0.1rem 0.35rem;border-radius:4px;font-size:0.82em">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin:0.6rem 0;line-height:1.75;color:var(--fg-muted)">')
    .replace(/^(?!<)(.+)$/gm, (m) => m.startsWith('<') ? m : `<p style="margin:0.6rem 0;line-height:1.75;color:var(--fg-muted)">${m}</p>`);
}

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(file.type)) {
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
      onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
      className="relative rounded-2xl overflow-hidden border-2 border-dashed transition-all"
      style={{
        height: value ? 200 : 130,
        borderColor: dragOver ? '#8b5cf6' : 'var(--border)',
        background: value ? 'transparent' : dragOver ? 'rgba(139,92,246,0.07)' : 'var(--bg)',
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
        onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }}
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

function InternshipPreview({ form }: { form: any }) {
  const readTime = estimateReadTime(form.content || '');
  const tags = (form.tagsRaw || '').split(',').map((t: string) => t.trim()).filter(Boolean);
  const authorName = form.authorName || 'Admin';
  const authorAvatar = form.authorAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7c3aed&color=fff&size=60`;

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
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-xl p-3 border" style={{ borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' }}>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.internshipType && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
              <GraduationCap className="w-3 h-3 text-brand-500" />
              {INTERNSHIP_TYPE_LABELS[form.internshipType] || form.internshipType}
            </span>
          )}
          {form.internshipLocation && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
              <MapPin className="w-3 h-3 text-brand-500" />{form.internshipLocation}
            </span>
          )}
          {form.internshipDuration && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
              <CalendarDays className="w-3 h-3 text-brand-500" />{form.internshipDuration}
            </span>
          )}
          {form.internshipLevel && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
              <BookOpen className="w-3 h-3 text-brand-500" />
              {INTERNSHIP_LEVEL_LABELS[form.internshipLevel] || form.internshipLevel}
            </span>
          )}
          {(form.internshipAllowanceMin || form.internshipAllowanceMax) && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
              <DollarSign className="w-3 h-3 text-brand-500" />
              {form.internshipAllowanceMin && Number(form.internshipAllowanceMin).toLocaleString()}
              {form.internshipAllowanceMin && form.internshipAllowanceMax && ' – '}
              {form.internshipAllowanceMax && Number(form.internshipAllowanceMax).toLocaleString()}
              {' '}{form.internshipAllowanceCurrency || 'MAD'}/mois
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-brand-500">
          <Send className="w-3 h-3" /> Postuler maintenant
        </div>
      </div>

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

function InternshipEditor({ initial, isNew, onSave, onClose }: {
  initial: Partial<InternshipArticle>;
  isNew: boolean;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [form, setForm] = useState({
    title:                       initial.title || '',
    category:                    initial.category || 'career',
    imageUrl:                    initial.imageUrl || '',
    excerpt:                     initial.excerpt || '',
    content:                     initial.content || '',
    tagsRaw:                     (initial.tags || []).join(', '),
    authorName:                  (initial.author as any)?.name || '',
    authorRole:                  (initial.author as any)?.role || '',
    authorAvatar:                (initial.author as any)?.avatar || '',
    published:                   initial.published ?? true,
    internshipPosition:          initial.jobPosition || '',
    internshipDepartment:        initial.jobDepartment || '',
    internshipLocation:          initial.jobLocation || '',
    internshipDuration:          initial.stageDuration || '',
    internshipType:              (initial.tags || []).find(t => ['paid','unpaid','alternance','pfe'].includes(t)) || 'paid',
    internshipAllowanceMin:      initial.jobSalaryMin?.toString() || '',
    internshipAllowanceMax:      initial.jobSalaryMax?.toString() || '',
    internshipAllowanceCurrency: initial.jobSalaryCurrency || 'MAD',
    internshipLevel:             (initial.tags || []).find(t => ['bac2','bac3','bac5','doctorat','open'].includes(t)) || 'bac5',
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Titre et contenu obligatoires'); return; }
    if (!form.internshipPosition) { toast.error("L'intitulé du stage est obligatoire"); return; }
    setSaving(true);
    try {
      const userTags = form.tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean);
      const payload: any = {
        title:             form.title,
        content:           form.content,
        excerpt:           form.excerpt,
        type:              'job',
        jobType:           'stage',
        category:          form.category,
        imageUrl:          form.imageUrl,
        tags:              userTags,
        published:         form.published,
        readTime:          estimateReadTime(form.content),
        jobPosition:       form.internshipPosition,
        jobDepartment:     form.internshipDepartment,
        jobLocation:       form.internshipLocation,
        stageDuration:     form.internshipDuration,
        jobSalaryMin:      form.internshipAllowanceMin ? parseInt(form.internshipAllowanceMin) : null,
        jobSalaryMax:      form.internshipAllowanceMax ? parseInt(form.internshipAllowanceMax) : null,
        jobSalaryCurrency: form.internshipAllowanceCurrency,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
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
              {isNew ? 'Nouvelle offre de stage' : 'Modifier le stage'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl p-0.5 border border-[var(--border)] md:hidden" style={{ background: 'var(--bg-2)' }}>
              {([['edit', PenLine, 'Éditeur'], ['preview', Eye, 'Aperçu']] as const).map(([key, Icon, label]) => (
                <button key={key} onClick={() => setTab(key as any)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
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

            <Field label="Tags" hint="Séparés par des virgules — ex : React, Stage, PFE">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                <input value={form.tagsRaw} onChange={e => set('tagsRaw', e.target.value)}
                  className={inputCls + ' pl-9'} style={inputStyle}
                  placeholder="React, Node.js, PFE, Bac+5" />
              </div>
            </Field>

            <Field label="Titre *">
              <textarea rows={2} value={form.title} onChange={e => set('title', e.target.value)}
                className={inputCls + ' resize-none font-bold text-base leading-snug'} style={inputStyle}
                placeholder="Stage PFE — Développeur Fullstack React / Node.js" />
            </Field>

            <div className="rounded-xl border border-[var(--border)] p-4 space-y-3" style={{ background: 'var(--bg-2)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Auteur</p>
              <div className="flex gap-3 items-start">
                <div
                  className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[var(--border)] cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--bg)' }}
                  onClick={() => document.getElementById('avatar-upload-internship')?.click()}
                  title="Cliquez pour changer l'avatar"
                >
                  {form.authorAvatar ? (
                    <img src={form.authorAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-0.5">
                      <User className="w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                      <span className="text-[8px]" style={{ color: 'var(--fg-muted)' }}>Photo</span>
                    </div>
                  )}
                  <input id="avatar-upload-internship" type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]; if (!f) return;
                      const token = getToken();
                      const fd = new FormData(); fd.append('image', f);
                      try {
                        const res = await fetch(`${API_BASE}/api/upload`, {
                          method: 'POST',
                          headers: token ? { Authorization: `Bearer ${token}` } : {},
                          body: fd,
                        });
                        const d = await res.json();
                        set('authorAvatar', d.url);
                      } catch {
                        set('authorAvatar', URL.createObjectURL(f));
                      }
                    }} />
                </div>
                <div className="flex-1 space-y-2">
                  <input value={form.authorName} onChange={e => set('authorName', e.target.value)}
                    className={inputCls} style={inputStyle} placeholder="Sara Idrissi" />
                  <input value={form.authorRole} onChange={e => set('authorRole', e.target.value)}
                    className={inputCls} style={inputStyle} placeholder="DRH / Responsable Stages" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <div className={inputCls + ' flex items-center gap-2 opacity-60 cursor-not-allowed'} style={inputStyle}>
                  <GraduationCap className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Offre de stage</span>
                </div>
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

            <div className="rounded-xl border p-4 space-y-4"
              style={{ borderColor: 'rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">
                  Détails de l'offre de stage
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Intitulé du stage *">
                  <input value={form.internshipPosition} onChange={e => set('internshipPosition', e.target.value)}
                    className={inputCls} style={inputStyle} placeholder="Stage PFE Développeur Fullstack" />
                </Field>
                <Field label="Département">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                    <input value={form.internshipDepartment} onChange={e => set('internshipDepartment', e.target.value)}
                      className={inputCls + ' pl-9'} style={inputStyle} placeholder="Engineering" />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Localisation">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                    <input value={form.internshipLocation} onChange={e => set('internshipLocation', e.target.value)}
                      className={inputCls + ' pl-9'} style={inputStyle} placeholder="Casablanca (Présentiel)" />
                  </div>
                </Field>
                <Field label="Type de stage">
                  <select value={form.internshipType} onChange={e => set('internshipType', e.target.value)} className={inputCls} style={inputStyle}>
                    <option value="paid">Stage rémunéré</option>
                    <option value="unpaid">Stage non rémunéré</option>
                    <option value="alternance">Alternance</option>
                    <option value="pfe">PFE (Fin d'études)</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Durée">
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                    <input value={form.internshipDuration} onChange={e => set('internshipDuration', e.target.value)}
                      className={inputCls + ' pl-9'} style={inputStyle} placeholder="3 mois, 6 mois..." />
                  </div>
                </Field>
                <Field label="Niveau requis">
                  <select value={form.internshipLevel} onChange={e => set('internshipLevel', e.target.value)} className={inputCls} style={inputStyle}>
                    <option value="bac2">Bac+2</option>
                    <option value="bac3">Bac+3</option>
                    <option value="bac5">Bac+5 (Master / Ingénieur)</option>
                    <option value="doctorat">Doctorat</option>
                    <option value="open">Tous niveaux</option>
                  </select>
                </Field>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>
                  Gratification (optionnelle)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                    <input type="number" value={form.internshipAllowanceMin}
                      onChange={e => set('internshipAllowanceMin', e.target.value)}
                      className={inputCls + ' pl-9'} style={inputStyle} placeholder="Min — ex : 2000" />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                    <input type="number" value={form.internshipAllowanceMax}
                      onChange={e => set('internshipAllowanceMax', e.target.value)}
                      className={inputCls + ' pl-9'} style={inputStyle} placeholder="Max — ex : 4000" />
                  </div>
                  <select value={form.internshipAllowanceCurrency}
                    onChange={e => set('internshipAllowanceCurrency', e.target.value)}
                    className={inputCls} style={inputStyle}>
                    <option value="MAD">MAD</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--fg-muted)' }}>
                  Min / Max / Devise — ex : 2 000 – 4 000 MAD/mois
                </p>
              </div>
            </div>

            <Field label="Résumé" hint="Affiché dans la liste du blog">
              <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                className={inputCls + ' resize-none'} style={inputStyle}
                placeholder="Nous recherchons un(e) stagiaire passionné(e) pour rejoindre notre équipe technique..." />
            </Field>

            <Field label="Contenu (Markdown) *" hint="## Titre  |  ### Sous-titre  |  **gras**  |  > citation  |  `code`">
              <textarea rows={14} value={form.content} onChange={e => set('content', e.target.value)}
                className={inputCls + ' resize-y font-mono text-xs leading-relaxed'} style={inputStyle}
                placeholder={"## À propos du stage\n\nNous cherchons un(e) stagiaire motivé(e) pour rejoindre notre équipe...\n\n## Missions\n\n- Participer au développement de nouvelles fonctionnalités\n- Collaborer avec l'équipe technique\n\n## Profil recherché\n\n- Étudiant(e) en école d'ingénieurs ou Master informatique\n- Maîtrise de React, TypeScript\n\n## Ce que nous offrons\n\n- Encadrement par des experts\n- Possibilité d'embauche"} />
            </Field>

            <label className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:border-brand-500 transition-colors select-none"
              style={{
                borderColor: form.published ? '#8b5cf6' : 'var(--border)',
                background: form.published ? 'rgba(139,92,246,0.06)' : 'var(--bg-2)',
              }}>
              <div className="relative w-10 h-6 rounded-full transition-colors shrink-0"
                style={{ background: form.published ? '#8b5cf6' : 'var(--border)' }}>
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
            <InternshipPreview form={form} />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0"
          style={{ background: 'var(--card-bg, var(--bg))' }}>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center"
            style={{ '--btn-primary-bg': '#8b5cf6', '--btn-primary-hover': '#7c3aed' } as any}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Sauvegarde...' : 'Publier le stage'}
          </button>
          <button onClick={onClose} disabled={saving} className="btn btn-outline px-8">Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState<InternshipArticle[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [editing, setEditing]         = useState<Partial<InternshipArticle> | null>(null);
  const [isNew, setIsNew]             = useState(false);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/articles?type=job&jobType=stage');
      setInternships(data.articles ?? data);
    } catch (err: any) {
      toast.error(err.message || 'Impossible de charger les stages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInternships(); }, []);

  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.jobLocation  ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (i.jobPosition  ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette offre de stage définitivement ?')) return;
    try {
      await apiFetch(`/api/articles/${id}`, { method: 'DELETE' });
      setInternships(prev => prev.filter(i => i.id !== id));
      toast.success('Stage supprimé');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSave = async (payload: any) => {
    if (isNew) {
      const created = await apiFetch('/api/articles', { method: 'POST', body: JSON.stringify(payload) });
      setInternships(prev => [created, ...prev]);
      toast.success('Offre de stage publiée avec succès');
    } else {
      const updated = await apiFetch(`/api/articles/${editing!.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setInternships(prev => prev.map(i => i.id === editing!.id ? updated : i));
      toast.success('Stage mis à jour');
    }
    setEditing(null);
    setIsNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--fg)' }}>Offres de stage</h1>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            {loading ? '...' : `${internships.length} offre${internships.length > 1 ? 's' : ''} de stage`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing({ title: '', excerpt: '', content: '', type: 'job', jobType: 'stage', tags: [], published: true });
            setIsNew(true);
          }}
          className="btn btn-primary"
          style={{ '--btn-primary-bg': '#8b5cf6', '--btn-primary-hover': '#7c3aed' } as any}
        >
          <Plus className="w-4 h-4" /> Nouveau stage
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
        <input
          type="text"
          placeholder="Rechercher un stage, ville, poste..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          style={{ color: 'var(--fg)' }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fg-muted)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3"></p>
          <p className="font-medium" style={{ color: 'var(--fg)' }}>Aucune offre de stage trouvée</p>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>Créez votre première offre de stage</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(internship => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex items-start gap-4"
            >
              {internship.imageUrl && (
                <img src={internship.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>{internship.title}</h3>
                    {internship.jobPosition && (
                      <p className="text-xs text-brand-500 font-medium mt-0.5">{internship.jobPosition}</p>
                    )}
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--fg-muted)' }}>{internship.excerpt}</p>
                    {!internship.published && (
                      <span className="text-[10px] text-orange-400 font-medium">Brouillon</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={`/blog/${internship.slug}`} target="_blank"
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-2)] transition-colors"
                      style={{ color: 'var(--fg-muted)' }}>
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => { setEditing({ ...internship }); setIsNew(false); }}
                      className="p-1.5 rounded-lg hover:bg-brand-500/10 text-brand-500 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(internship.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {internship.jobLocation && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                      <MapPin className="w-3 h-3" /> {internship.jobLocation}
                    </span>
                  )}
                  {internship.stageDuration && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                      <CalendarDays className="w-3 h-3" /> {internship.stageDuration}
                    </span>
                  )}
                  {internship.jobSalaryMin != null && internship.jobSalaryMax != null && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                      <DollarSign className="w-3 h-3" />
                      {internship.jobSalaryMin.toLocaleString()} – {internship.jobSalaryMax.toLocaleString()} {internship.jobSalaryCurrency ?? 'MAD'}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    Publié le {internship.publishedAt
                      ? format(new Date(internship.publishedAt), 'd MMM yyyy', { locale: fr })
                      : format(new Date(internship.createdAt), 'd MMM yyyy', { locale: fr })}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {(internship.views ?? 0).toLocaleString()} vues
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <InternshipEditor
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