'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Search, X, Save, Star, Loader2, Upload, ImageIcon, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: number;
  title: string;
  category: 'web' | 'mobile' | 'ai' | 'cloud' | 'security';
  description: string;
  longDesc?: string;
  image?: string;
  technologies: string[];
  results: string[];
  demo?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
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

const CATEGORY_COLORS: Record<string, string> = {
  web: 'badge-primary',
  mobile: 'badge-success',
  ai: 'badge-warning',
  cloud: 'badge-info',
  security: 'badge-error',
};

const CATEGORY_LABELS: Record<string, string> = {
  web: 'Web',
  mobile: 'Mobile',
  ai: 'IA / ML',
  cloud: 'Cloud',
  security: 'Sécurité',
};

function ImageUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowed.includes(file.type)) {
        toast.error('Format non supporté. Utilisez JPG, PNG, GIF, WEBP ou SVG.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 10 Mo)');
        return;
      }

      setUploading(true);
      try {
        const token = getToken();
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(err.error || "Erreur lors de l'upload");
        }

        const data = await res.json();
        onChange(data.url);
        toast.success('Image uploadée avec succès !');
      } catch (err: any) {
        toast.error(err.message || "Erreur lors de l'upload");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2
          rounded-xl border-2 border-dashed cursor-pointer
          py-8 px-4 transition-all text-center
          ${dragOver
            ? 'border-brand-500 bg-brand-500/5'
            : 'border-[var(--border)] hover:border-brand-500/50 hover:bg-brand-500/5'
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--fg-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Upload en cours...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8" style={{ color: 'var(--fg-muted)' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                Glissez une image ici ou <span className="text-brand-500">cliquez pour choisir</span>
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>
                JPG, PNG, GIF, WEBP, SVG — max 10 Mo
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />
      </div>

      {value && (
        <div className="relative rounded-xl overflow-hidden border border-[var(--border)]" style={{ height: '160px' }}>
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/50 to-transparent">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/90 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Supprimer
            </button>
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-black/40 text-white backdrop-blur-sm">
            <ImageIcon className="w-3 h-3" /> Aperçu
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>ou entrez une URL</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        style={{ color: 'var(--fg)' }}
      />
    </div>
  );
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [previewing, setPreviewing] = useState<Project | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/projects');
      setProjects(Array.isArray(data) ? data : data.projects ?? []);
    } catch (err: any) {
      toast.error(err.message || 'Impossible de charger les projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce projet définitivement ?')) return;
    try {
      await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Projet supprimé');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = await apiFetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !project.featured }),
      });
      setProjects(prev => prev.map(p => p.id === project.id ? updated : p));
      toast.success(!project.featured ? 'Mis en avant ' : 'Retiré de la mise en avant');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSave = async () => {
    if (!editing || !editing.title || !editing.description) {
      toast.error('Le titre et la description sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title:        editing.title,
        category:     editing.category ?? 'web',
        description:  editing.description,
        longDesc:     editing.longDesc ?? '',
        image:        editing.image ?? '',
        technologies: editing.technologies ?? [],
        results:      editing.results ?? [],
        demo:         editing.demo ?? '',
        featured:     editing.featured ?? false,
        published:    editing.published ?? true,
      };

      if (isNew) {
        const created = await apiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setProjects(prev => [created, ...prev]);
        toast.success('Projet créé avec succès !');
      } else {
        const updated = await apiFetch(`/api/projects/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setProjects(prev => prev.map(p => p.id === editing.id ? updated : p));
        toast.success('Projet mis à jour');
      }

      setEditing(null);
      setIsNew(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--fg)' }}>Portfolio</h1>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            {loading ? '...' : `${projects.length} projet${projects.length > 1 ? 's' : ''} · ${projects.filter(p => p.featured).length} mis en avant`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing({ title: '', description: '', longDesc: '', category: 'web', technologies: [], results: [], demo: '', featured: false, published: true, image: '' });
            setIsNew(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
        <input
          type="text"
          placeholder="Rechercher un projet ou catégorie..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          style={{ color: 'var(--fg)' }}
        />
      </div>

      <div className="card overflow-hidden" style={{ padding: 0 }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fg-muted)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3"></p>
            <p className="font-medium" style={{ color: 'var(--fg)' }}>Aucun projet trouvé</p>
            <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>Ajoutez votre premier projet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--bg-2)' }}>
              <tr className="text-left">
                {['Projet', 'Catégorie', 'Technologies', 'Mis en avant', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(project => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[var(--bg-2)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {project.image ? (
                        <img src={project.image} alt="" className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div
                          className="w-12 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'var(--bg-2)' }}
                        >
                          <ImageIcon className="w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-xs line-clamp-1 max-w-[180px]" style={{ color: 'var(--fg)' }}>
                          {project.title}
                        </p>
                        <p className="text-[10px] mt-0.5 line-clamp-1 max-w-[180px]" style={{ color: 'var(--fg-muted)' }}>
                          {project.description}
                        </p>
                        {!project.published && (
                          <span className="text-[10px] text-orange-400 font-medium">Non publié</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${CATEGORY_COLORS[project.category] ?? 'badge-primary'} text-[10px]`}>
                      {CATEGORY_LABELS[project.category] ?? project.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ background: 'var(--bg-2)', color: 'var(--fg-muted)' }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{ background: 'var(--bg-2)', color: 'var(--fg-muted)' }}
                        >
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-1.5 rounded-lg transition-colors ${project.featured ? 'text-yellow-500 bg-yellow-500/10' : 'hover:bg-[var(--bg-2)]'}`}
                      style={!project.featured ? { color: 'var(--fg-muted)' } : {}}
                      title={project.featured ? 'Retirer de la mise en avant' : 'Mettre en avant'}
                    >
                      <Star className="w-4 h-4" fill={project.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-[var(--bg)] transition-colors"
                          style={{ color: 'var(--fg-muted)' }}
                          title="Voir la démo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setPreviewing(project)}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                        title="Prévisualiser"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setEditing({ ...project }); setIsNew(false); }}
                        className="p-1.5 rounded-lg hover:bg-brand-500/10 text-brand-500 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Supprimer"
                      >
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <h2 className="font-display font-bold text-xl" style={{ color: 'var(--fg)' }}>
                  {isNew ? 'Nouveau projet' : 'Modifier le projet'}
                </h2>
                <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ color: 'var(--fg-muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Titre *</label>
                  <input
                    value={editing.title || ''}
                    onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                    placeholder="ex: OmniPay — Fintech Platform"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ color: 'var(--fg)' }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Catégorie</label>
                  <select
                    value={editing.category || 'web'}
                    onChange={e => setEditing(p => ({ ...p, category: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ color: 'var(--fg)' }}
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="ai">IA / ML</option>
                    <option value="cloud">Cloud</option>
                    <option value="security">Sécurité</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>
                    Image du projet
                  </label>
                  <ImageUploader
                    value={editing.image}
                    onChange={url => setEditing(p => ({ ...p, image: url }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Description courte *</label>
                  <textarea
                    rows={2}
                    value={editing.description || ''}
                    onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                    placeholder="ex: Solution fintech complète qui a traité plus de 500M MAD de transactions"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    style={{ color: 'var(--fg)' }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Description longue</label>
                  <textarea
                    rows={4}
                    value={editing.longDesc || ''}
                    onChange={e => setEditing(p => ({ ...p, longDesc: e.target.value }))}
                    placeholder="ex: OmniPay est une solution fintech complète qui a traité plus de 500M MAD de transactions depuis son lancement. Nous avons développé l'ensemble de la plateforme en 6 mois avec une équipe de 5 développeurs."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    style={{ color: 'var(--fg)' }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Technologies (séparées par des virgules)</label>
                  <input
                    value={(editing.technologies ?? []).join(', ')}
                    onChange={e => setEditing(p => ({ ...p, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                    placeholder="ex: Next.js, Node.js, PostgreSQL, Redis, Stripe, Docker"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ color: 'var(--fg)' }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Résultats (séparés par des virgules)</label>
                  <input
                    value={(editing.results ?? []).join(', ')}
                    onChange={e => setEditing(p => ({ ...p, results: e.target.value.split(',').map(r => r.trim()).filter(Boolean) }))}
                    placeholder="ex: 500M MAD traités, 3 000 entreprises, +40% conversions"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ color: 'var(--fg)' }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>URL Démo</label>
                  <input
                    value={editing.demo || ''}
                    onChange={e => setEditing(p => ({ ...p, demo: e.target.value }))}
                    placeholder="https://omnipay.ma/"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ color: 'var(--fg)' }}
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editing.featured ?? false}
                      onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))}
                      className="w-4 h-4 rounded accent-brand-500"
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Mettre en avant</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editing.published ?? true}
                      onChange={e => setEditing(p => ({ ...p, published: e.target.checked }))}
                      className="w-4 h-4 rounded accent-brand-500"
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Publier</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary flex-1 justify-center"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => { setEditing(null); setIsNew(false); }}
                    className="btn btn-outline flex-1 justify-center"
                    disabled={saving}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            onClick={() => setPreviewing(null)}
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
                {previewing.image ? (
                  <img src={previewing.image} alt={previewing.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16" style={{ color: 'var(--fg-muted)', opacity: 0.3 }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Prévisualisation
                  </span>
                  {!previewing.published && (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-orange-500/80 text-white backdrop-blur-sm">
                      Non publié
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-6">
                  <span className="badge badge-primary capitalize text-[10px] mb-2 block w-fit">
                    {CATEGORY_LABELS[previewing.category] ?? previewing.category}
                  </span>
                  <h2 className="font-display font-bold text-white text-2xl">{previewing.title}</h2>
                </div>
              </div>

              <div className="p-8">
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--fg-muted)' }}>
                  {previewing.longDesc || previewing.description}
                </p>

                {previewing.technologies.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--fg)' }}>
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {previewing.technologies.map(t => (
                        <span key={t} className="badge badge-primary">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {previewing.results.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--fg)' }}>
                      Résultats
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {previewing.results.map((r, i) => (
                        <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>
                          <div className="text-sm font-bold text-emerald-500">{r}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {previewing.demo && previewing.demo !== '#' && (
                    <a
                      href={previewing.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary flex-1 justify-center"
                    >
                      Voir la démo <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => { setPreviewing(null); setEditing({ ...previewing }); setIsNew(false); }}
                    className="btn btn-outline justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Modifier
                  </button>
                  <button onClick={() => setPreviewing(null)} className="btn btn-outline flex-1 justify-center">
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