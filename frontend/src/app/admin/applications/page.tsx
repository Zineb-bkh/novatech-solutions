'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Eye, Search, X, Mail, Phone, Linkedin, Globe,
  Loader2, RefreshCw, FileText, Brain, Star, TrendingUp,
  CheckCircle, XCircle, Clock, AlertCircle, ChevronUp, ChevronDown,
  Users, Zap, ChevronRight, Briefcase, GraduationCap, Building2,
  Inbox,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('novatech_token');
}

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  coverLetter?: string;
  skills?: string;
  education?: string;
  school?: string;
  filiere?: string;
  duration?: string;
  cvFilename?: string;
  status: string;
  jobType?: string;
  jobPosition?: string;
  createdAt: string;
  aiScore?: number;
  aiCategory?: string;
  aiRecommendation?: string;
  aiFeedback?: string;
  aiNotes?: string;
  aiAnalyzedAt?: string;
  job?: { id: number; title: string; jobPosition?: string };
}

interface JobGroup {
  jobId: number | null;
  title: string;
  jobType: 'emploi' | 'stage' | 'spontanée';
  applications: Application[];
  avgScore: number | null;
  shortlistCount: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:     { label: 'En attente',  color: '#b45309', bg: '#fef3c7', icon: Clock },
  reviewed:    { label: 'Examinée',    color: '#1d4ed8', bg: '#dbeafe', icon: Eye },
  interviewed: { label: 'Entretien',   color: '#7c3aed', bg: '#ede9fe', icon: Users },
  accepted:    { label: 'Acceptée',    color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
  rejected:    { label: 'Refusée',     color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
};

function getScoreStyle(score?: number) {
  if (!score && score !== 0) return { color: '#9ca3af', bg: '#f3f4f6', label: 'N/A' };
  if (score >= 80) return { color: '#15803d', bg: '#dcfce7', label: 'Excellent' };
  if (score >= 70) return { color: '#1d4ed8', bg: '#dbeafe', label: 'Bon' };
  if (score >= 50) return { color: '#b45309', bg: '#fef3c7', label: 'Moyen' };
  return { color: '#b91c1c', bg: '#fee2e2', label: 'Insuffisant' };
}

function ScoreRing({ score }: { score?: number }) {
  const style = getScoreStyle(score);
  const pct   = score ?? 0;
  const r     = 20;
  const circ  = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width={56} height={56} viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={28} cy={28} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5} />
        <circle
          cx={28} cy={28} r={r} fill="none"
          stroke={style.color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xs font-black leading-none" style={{ color: style.color }}>
          {score != null ? score : '—'}
        </span>
      </div>
    </div>
  );
}

function ScoreBar({ score }: { score?: number }) {
  const style = getScoreStyle(score);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e7eb', minWidth: 60 }}>
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${score ?? 0}%`, background: style.color }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color: style.color }}>
        {score != null ? score : '—'}
      </span>
    </div>
  );
}

function groupByJob(applications: Application[]): JobGroup[] {
  const map = new Map<string, JobGroup>();

  for (const app of applications) {
    const key = app.job?.id != null ? String(app.job.id) : 'spontanée';
    const title = app.job?.title || app.job?.jobPosition || app.jobPosition || 'Candidature spontanée';
    const rawType = app.jobType ?? 'emploi';
    const jobType: 'emploi' | 'stage' | 'spontanée' =
      key === 'spontanée' ? 'spontanée' : (rawType === 'stage' ? 'stage' : 'emploi');

    if (!map.has(key)) {
      map.set(key, {
        jobId: app.job?.id ?? null,
        title,
        jobType,
        applications: [],
        avgScore: null,
        shortlistCount: 0,
      });
    }
    map.get(key)!.applications.push(app);
  }

  const groups = Array.from(map.values()).map(g => {
    const scored = g.applications.filter(a => a.aiScore != null);
    const avgScore = scored.length
      ? Math.round(scored.reduce((s, a) => s + (a.aiScore ?? 0), 0) / scored.length)
      : null;
    const shortlistCount = g.applications.filter(a => (a.aiScore ?? 0) >= 70).length;
    return { ...g, avgScore, shortlistCount };
  });

  const order = { emploi: 0, stage: 1, spontanée: 2 };
  return groups.sort((a, b) => {
    if (order[a.jobType] !== order[b.jobType]) return order[a.jobType] - order[b.jobType];
    return b.applications.length - a.applications.length;
  });
}

export default function AdminApplicationsPage() {
  const [applications, setApplications]     = useState<Application[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [statusFilter, setStatusFilter]     = useState('all');
  const [typeFilter, setTypeFilter]         = useState('all');
  const [sortBy, setSortBy]                 = useState<'date' | 'score'>('score');
  const [sortDir, setSortDir]               = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected]             = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [reAnalyzing, setReAnalyzing]       = useState<number | null>(null);
  const [openGroups, setOpenGroups]         = useState<Set<string>>(new Set(['all']));

  const stats = useMemo(() => ({
    total:     applications.length,
    shortlist: applications.filter(a => (a.aiScore ?? 0) >= 70).length,
    pending:   applications.filter(a => a.status === 'pending').length,
    avgScore:  (() => {
      const scored = applications.filter(a => a.aiScore != null);
      return scored.length ? Math.round(scored.reduce((s, a) => s + (a.aiScore ?? 0), 0) / scored.length) : 0;
    })(),
  }), [applications]);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const token  = getToken();
      const params = new URLSearchParams({ limit: '200' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter   !== 'all') params.set('jobType', typeFilter);

      const res = await fetch(`${API_BASE}/api/applications?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Impossible de charger les candidatures');
      const data = await res.json();
      const list: Application[] = Array.isArray(data) ? data : data.applications ?? [];
      setApplications(list);

      const grouped = groupByJob(list);
      setOpenGroups(new Set(grouped.map(g => g.jobId != null ? String(g.jobId) : 'spontanée')));
    } catch (err: any) {
      toast.error(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const filteredApps = useMemo(() => {
    return applications.filter(a => {
      if (!search) return true;
      const q   = search.toLowerCase();
      const pos = a.jobPosition || a.job?.jobPosition || a.job?.title || '';
      return `${a.firstName} ${a.lastName} ${a.email} ${pos}`.toLowerCase().includes(q);
    });
  }, [applications, search]);

  const groups = useMemo(() => {
    const grouped = groupByJob(filteredApps);
    return grouped.map(g => ({
      ...g,
      applications: [...g.applications].sort((a, b) => {
        const mul = sortDir === 'desc' ? -1 : 1;
        if (sortBy === 'score') return mul * ((a.aiScore ?? -1) - (b.aiScore ?? -1));
        return mul * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }),
    }));
  }, [filteredApps, sortBy, sortDir]);

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const expandAll   = () => setOpenGroups(new Set(groups.map(g => g.jobId != null ? String(g.jobId) : 'spontanée')));
  const collapseAll = () => setOpenGroups(new Set());

  const toggleSort = (field: 'date' | 'score') => {
    if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingStatus(true);
    try {
      const token = getToken();
      const res   = await fetch(`${API_BASE}/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
      toast.success('Statut mis à jour');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const reAnalyze = async (app: Application) => {
    setReAnalyzing(app.id);
    try {
      const token = getToken();
      const res   = await fetch(`${API_BASE}/api/applications/${app.id}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Erreur re-analyse');
      const updated = await res.json();
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, ...updated } : a));
      if (selected?.id === app.id) setSelected(s => s ? { ...s, ...updated } : s);
      toast.success(`Score IA mis à jour : ${updated.aiScore}/100`);
    } catch {
      toast.error('Re-analyse indisponible — vérifiez la clé Gemini');
    } finally {
      setReAnalyzing(null);
    }
  };

  const downloadCv = async (app: Application) => {
    if (!app.cvFilename) { toast.error('Aucun CV disponible'); return; }
    try {
      const token = getToken();
      const res   = await fetch(`${API_BASE}/api/applications/${app.id}/cv`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('CV introuvable');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = app.cvFilename || `cv-${app.firstName}-${app.lastName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CV téléchargé');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const JobTypeIcon = ({ type }: { type: string }) => {
    if (type === 'stage')      return <GraduationCap className="w-3.5 h-3.5" />;
    if (type === 'spontanée')  return <Inbox className="w-3.5 h-3.5" />;
    return <Briefcase className="w-3.5 h-3.5" />;
  };

  const jobTypeBadge = (type: string) => {
    if (type === 'stage')     return { bg: 'rgba(124,58,237,0.1)',  color: '#7c3aed',  label: 'Stage' };
    if (type === 'spontanée') return { bg: 'rgba(107,114,128,0.1)', color: '#6b7280',  label: 'Spontanée' };
    return                           { bg: 'rgba(79,70,229,0.1)',   color: '#4f46e5',  label: 'Emploi' };
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--fg)' }}>
            Candidatures
          </h1>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            {loading ? '...' : `${applications.length} reçue${applications.length > 1 ? 's' : ''} · ${groups.length} offre${groups.length > 1 ? 's' : ''} · ${stats.shortlist} shortlistée${stats.shortlist > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={loadApplications}
          disabled={loading}
          className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-2)] transition-colors"
          style={{ color: 'var(--fg-muted)' }}
          title="Actualiser"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: 'Total',      value: stats.total,            color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
            { icon: Star,  label: 'Shortlist',  value: stats.shortlist,         color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
            { icon: Clock, label: 'En attente', value: stats.pending,           color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
            { icon: Brain, label: 'Score moy.', value: `${stats.avgScore}/100`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3" style={{ background: bg, border: `1px solid ${color}22` }}>
              <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>{label}</p>
                <p className="font-bold text-lg leading-tight" style={{ color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher candidat, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            style={{ color: 'var(--fg)' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          style={{ color: 'var(--fg)' }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          style={{ color: 'var(--fg)' }}
        >
          <option value="all">Emploi + Stage</option>
          <option value="emploi">Emploi</option>
          <option value="stage">Stage</option>
        </select>

        <div className="flex gap-1 p-1 rounded-xl border border-[var(--border)]" style={{ background: 'var(--bg-2)' }}>
          {[
            { key: 'score', label: 'Score IA' },
            { key: 'date',  label: 'Date' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSort(key as 'score' | 'date')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: sortBy === key ? 'var(--bg)' : 'transparent',
                color:      sortBy === key ? 'var(--fg)' : 'var(--fg-muted)',
                boxShadow:  sortBy === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
              {sortBy === key && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={expandAll}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-2)] transition-colors"
            style={{ color: 'var(--fg-muted)' }}
          >
            Tout ouvrir
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-2)] transition-colors"
            style={{ color: 'var(--fg-muted)' }}
          >
            Tout fermer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fg-muted)' }} />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium" style={{ color: 'var(--fg)' }}>Aucune candidature trouvée</p>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            {search || statusFilter !== 'all' ? "Essayez d'autres filtres" : 'Les candidatures apparaîtront ici'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group, gi) => {
            const key    = group.jobId != null ? String(group.jobId) : 'spontanée';
            const isOpen = openGroups.has(key);
            const badge  = jobTypeBadge(group.jobType);
            const scoreStyle = getScoreStyle(group.avgScore ?? undefined);
            const shortlistPct = group.applications.length > 0
              ? Math.round((group.shortlistCount / group.applications.length) * 100)
              : 0;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.04 }}
                className="card overflow-hidden"
                style={{ padding: 0 }}
              >
                <button
                  onClick={() => toggleGroup(key)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--bg-2)]"
                  style={{ borderBottom: isOpen ? '1px solid var(--border)' : 'none' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    <JobTypeIcon type={group.jobType} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate" style={{ color: 'var(--fg)' }}>
                        {group.title}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                      {group.shortlistCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#b45309' }}>
                          ⭐ {group.shortlistCount} shortlist{group.shortlistCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                      {group.applications.length} candidat{group.applications.length > 1 ? 's' : ''}
                      {group.avgScore != null && (
                        <> · score moy. <span style={{ color: scoreStyle.color, fontWeight: 600 }}>{group.avgScore}/100</span></>
                      )}
                    </p>
                  </div>

                  {group.applications.length > 0 && (
                    <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px]" style={{ color: 'var(--fg-muted)' }}>
                        {shortlistPct}% shortlistés
                      </span>
                      <div className="w-24 h-1.5 rounded-full" style={{ background: '#e5e7eb' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${shortlistPct}%`, background: '#f59e0b', transition: 'width 0.6s ease' }}
                        />
                      </div>
                    </div>
                  )}

                  <ChevronRight
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{ color: 'var(--fg-muted)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead style={{ background: 'var(--bg-2)' }}>
                            <tr className="text-left">
                              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Candidat</th>
                              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Score IA</th>
                              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Statut</th>
                              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Date</th>
                              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]">
                            {group.applications.map((app, i) => {
                              const st            = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
                              const isShortlisted = (app.aiScore ?? 0) >= 70;
                              const StatusIcon    = st.icon;

                              return (
                                <motion.tr
                                  key={app.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.02 }}
                                  className="hover:bg-[var(--bg-2)] transition-colors"
                                  style={isShortlisted ? { borderLeft: '3px solid #f59e0b' } : {}}
                                >
                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                                        style={{
                                          background: isShortlisted
                                            ? 'linear-gradient(135deg,#f59e0b,#ef4444)'
                                            : 'var(--bg-2)',
                                          color: isShortlisted ? 'white' : 'var(--fg-muted)',
                                        }}
                                      >
                                        {app.firstName[0]}{app.lastName[0]}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--fg)' }}>
                                          {app.firstName} {app.lastName}
                                          {isShortlisted && <span className="ml-1 text-[10px]">⭐</span>}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>{app.email}</p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-5 py-3.5" style={{ minWidth: 140 }}>
                                    {app.aiScore != null ? (
                                      <ScoreBar score={app.aiScore} />
                                    ) : (
                                      <button
                                        onClick={() => reAnalyze(app)}
                                        disabled={reAnalyzing === app.id}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-dashed border-[var(--border)] hover:border-brand-500 hover:text-brand-500 transition-all"
                                        style={{ color: 'var(--fg-muted)' }}
                                      >
                                        {reAnalyzing === app.id
                                          ? <Loader2 className="w-3 h-3 animate-spin" />
                                          : <Brain className="w-3 h-3" />}
                                        {reAnalyzing === app.id ? 'Analyse...' : 'Analyser'}
                                      </button>
                                    )}
                                  </td>

                                  <td className="px-5 py-3.5">
                                    <span
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold w-fit"
                                      style={{ background: st.bg, color: st.color }}
                                    >
                                      <StatusIcon className="w-3 h-3" />
                                      {st.label}
                                    </span>
                                  </td>

                                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--fg-muted)' }}>
                                    {format(new Date(app.createdAt), 'd MMM yyyy', { locale: fr })}
                                  </td>

                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => setSelected(app)}
                                        className="p-1.5 rounded-lg hover:bg-brand-500/10 text-brand-500 transition-colors"
                                        title="Voir le dossier"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => downloadCv(app)}
                                        disabled={!app.cvFilename}
                                        className={`p-1.5 rounded-lg transition-colors ${app.cvFilename ? 'hover:bg-emerald-500/10 text-emerald-500' : 'opacity-30 cursor-not-allowed'}`}
                                        style={!app.cvFilename ? { color: 'var(--fg-muted)' } : {}}
                                        title={app.cvFilename ? 'Télécharger CV' : 'Aucun CV'}
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                      {app.aiScore == null && (
                                        <button
                                          onClick={() => reAnalyze(app)}
                                          disabled={reAnalyzing === app.id}
                                          className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-colors"
                                          title="Analyser avec l'IA"
                                        >
                                          {reAnalyzing === app.id
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <Brain className="w-3.5 h-3.5" />}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (() => {
          const stStyle  = getScoreStyle(selected.aiScore);
          const st       = STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.pending;
          const position = selected.jobPosition || selected.job?.jobPosition || selected.job?.title || '—';

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
              onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[var(--border)]"
                style={{ background: 'var(--bg)' }}
              >
                <div
                  className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--border)]"
                  style={{ background: 'var(--bg)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                      style={{
                        background: (selected.aiScore ?? 0) >= 70
                          ? 'linear-gradient(135deg,#f59e0b,#ef4444)'
                          : 'var(--bg-2)',
                        color: (selected.aiScore ?? 0) >= 70 ? 'white' : 'var(--fg-muted)',
                      }}
                    >
                      {selected.firstName[0]}{selected.lastName[0]}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg" style={{ color: 'var(--fg)' }}>
                        {selected.firstName} {selected.lastName}
                      </h2>
                      <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>{position}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ color: 'var(--fg-muted)' }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-5">

                  {selected.aiScore != null ? (
                    <div
                      className="rounded-2xl p-5 border"
                      style={{ background: stStyle.bg, borderColor: `${stStyle.color}30` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4" style={{ color: stStyle.color }} />
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: stStyle.color }}>
                            Analyse IA — Gemini
                          </span>
                        </div>
                        <button
                          onClick={() => reAnalyze(selected)}
                          disabled={reAnalyzing === selected.id}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
                          style={{ borderColor: stStyle.color, color: stStyle.color, background: 'white' }}
                        >
                          {reAnalyzing === selected.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Zap className="w-3 h-3" />}
                          Re-analyser
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <ScoreRing score={selected.aiScore} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl font-black" style={{ color: stStyle.color }}>
                              {selected.aiScore}/100
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: `${stStyle.color}20`, color: stStyle.color }}
                            >
                              {selected.aiCategory}
                            </span>
                            {(selected.aiScore ?? 0) >= 70 && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700">
                                ⭐ Shortlist
                              </span>
                            )}
                          </div>
                          {selected.aiRecommendation && (
                            <p className="text-sm mt-1" style={{ color: stStyle.color }}>
                              → {selected.aiRecommendation}
                            </p>
                          )}
                        </div>
                      </div>

                      {selected.aiFeedback && (
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: `${stStyle.color}20` }}>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: stStyle.color }}>
                            Feedback pour le candidat
                          </p>
                          <p className="text-sm italic" style={{ color: 'var(--fg)' }}>"{selected.aiFeedback}"</p>
                        </div>
                      )}

                      {selected.aiNotes && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${stStyle.color}20` }}>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>
                            🔒 Notes recruteur (interne)
                          </p>
                          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>{selected.aiNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl p-5 border border-dashed border-[var(--border)] text-center">
                      <Brain className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--fg-muted)' }} />
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>Pas encore analysé</p>
                      <p className="text-xs mb-3" style={{ color: 'var(--fg-muted)' }}>Lancez l'analyse IA Gemini pour scorer ce candidat</p>
                      <button
                        onClick={() => reAnalyze(selected)}
                        disabled={reAnalyzing === selected.id}
                        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
                      >
                        {reAnalyzing === selected.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Brain className="w-4 h-4" />}
                        {reAnalyzing === selected.id ? 'Analyse en cours...' : 'Analyser avec Gemini IA'}
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { href: `mailto:${selected.email}`, icon: Mail, label: selected.email },
                      selected.phone     && { href: `tel:${selected.phone}`,       icon: Phone,    label: selected.phone },
                      selected.linkedin  && { href: selected.linkedin.startsWith('http')  ? selected.linkedin  : `https://${selected.linkedin}`,  icon: Linkedin, label: 'LinkedIn',  target: '_blank' },
                      selected.portfolio && { href: selected.portfolio.startsWith('http') ? selected.portfolio : `https://${selected.portfolio}`, icon: Globe,    label: 'Portfolio', target: '_blank' },
                    ].filter(Boolean).map((item: any, i) => (
                      <a
                        key={i}
                        href={item.href}
                        target={item.target}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm p-3 rounded-xl border border-[var(--border)] hover:border-brand-500 hover:text-brand-500 transition-colors truncate"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </a>
                    ))}
                  </div>

                  {selected.jobType === 'stage' && (selected.school || selected.filiere || selected.duration) && (
                    <div className="rounded-xl p-4 border border-[var(--border)]" style={{ background: 'rgba(124,58,237,0.04)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7c3aed' }}>🎓 Infos Stage</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {selected.school    && <div><span style={{ color: 'var(--fg-muted)' }}>École : </span><strong style={{ color: 'var(--fg)' }}>{selected.school}</strong></div>}
                        {selected.filiere   && <div><span style={{ color: 'var(--fg-muted)' }}>Filière : </span><strong style={{ color: 'var(--fg)' }}>{selected.filiere}</strong></div>}
                        {selected.duration  && <div><span style={{ color: 'var(--fg-muted)' }}>Durée : </span><strong style={{ color: 'var(--fg)' }}>{selected.duration}</strong></div>}
                        {selected.education && <div><span style={{ color: 'var(--fg-muted)' }}>Niveau : </span><strong style={{ color: 'var(--fg)' }}>{selected.education}</strong></div>}
                      </div>
                    </div>
                  )}

                  {selected.cvFilename && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]" style={{ background: 'var(--bg-2)' }}>
                      <FileText className="w-5 h-5 text-brand-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--fg)' }}>{selected.cvFilename}</p>
                        <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>CV joint (PDF)</p>
                      </div>
                      <button
                        onClick={() => downloadCv(selected)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500 text-white"
                      >
                        <Download className="w-3.5 h-3.5" /> Télécharger
                      </button>
                    </div>
                  )}

                  {selected.skills && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-muted)' }}>Compétences</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.skills.split(/[,;|\n]/).map(s => s.trim()).filter(Boolean).map((skill, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.coverLetter && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-muted)' }}>Lettre de motivation</p>
                      <div className="rounded-xl p-4 border border-[var(--border)]" style={{ background: 'var(--bg-2)' }}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--fg)' }}>
                          {selected.coverLetter}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--fg-muted)' }}>
                      Changer le statut
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => {
                        const Icon = v.icon;
                        return (
                          <button
                            key={k}
                            onClick={() => updateStatus(selected.id, k)}
                            disabled={updatingStatus}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                            style={{
                              background:    selected.status === k ? v.bg : 'transparent',
                              color:         selected.status === k ? v.color : 'var(--fg-muted)',
                              borderColor:   selected.status === k ? `${v.color}50` : 'var(--border)',
                              outline:       selected.status === k ? `2px solid ${v.color}` : 'none',
                              outlineOffset: selected.status === k ? '1px' : '0',
                            }}
                          >
                            <Icon className="w-3 h-3" /> {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {selected.cvFilename && (
                      <button onClick={() => downloadCv(selected)} className="btn btn-primary flex-1 justify-center">
                        <Download className="w-4 h-4" /> CV
                      </button>
                    )}
                    <button onClick={() => setSelected(null)} className="btn btn-outline flex-1 justify-center">
                      Fermer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}