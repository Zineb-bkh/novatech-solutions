'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Briefcase, Eye, Download,
  TrendingUp, Plus, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Stats {
  totalApplications: number;
  publishedArticles: number;
  publishedProjects: number;
  activeSubscribers: number;
  activeJobs: number;
  newAppsThisWeek: number;
  newAppsThisMonth: number;
  byStatus: { pending: number; reviewed: number; interviewed: number; accepted: number; rejected: number };
  monthlyApplications: number[];
  monthLabels: string[];
}

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobPosition: string;
  jobType: string;
  status: string;
  createdAt: string;
  cvFilename?: string;
  cvPath?: string;
  job?: { id: number; title: string };
}

interface Article {
  id: number;
  title: string;
  type: string;
  views: number;
  likes: number;
  published: boolean;
  createdAt: string;
}

const STATUS_CFG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  pending:     { label: 'En attente',  bg: 'rgba(245,158,11,0.12)',  color: '#d97706',       dot: '#f59e0b'        },
  reviewed:    { label: 'Examinée',    bg: 'rgba(99,102,241,0.12)',  color: 'var(--brand)',  dot: 'var(--brand)'   },
  interviewed: { label: 'Entretien',   bg: 'rgba(139,92,246,0.12)', color: 'var(--accent)', dot: 'var(--accent)'  },
  accepted:    { label: 'Acceptée',    bg: 'rgba(16,185,129,0.12)', color: '#10b981',        dot: '#10b981'        },
  rejected:    { label: 'Refusée',     bg: 'rgba(239,68,68,0.12)',  color: '#ef4444',        dot: '#ef4444'        },
};

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('novatech_token') : null;
}

export default function AdminDashboard() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [apps, setApps]         = useState<Application[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    const token = getToken();
    if (!token) { setError('Non authentifié'); setLoading(false); return; }

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const [sRes, aRes, artRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`,                    { headers }),
        fetch(`${API}/api/admin/applications?limit=5`,    { headers }),
        fetch(`${API}/api/admin/articles?limit=5`,         { headers }),
      ]);

      if (!sRes.ok) throw new Error(`Stats: ${sRes.status}`);

      const raw     = await sRes.json();
      const aData   = aRes.ok ? await aRes.json() : [];
      const artData = artRes.ok ? await artRes.json() : { articles: [] };

      const normalized: Stats = {
        totalApplications:   raw.totalApplications   ?? raw.applications          ?? 0,
        publishedArticles:   raw.publishedArticles   ?? raw.articles              ?? 0,
        publishedProjects:   raw.publishedProjects   ?? raw.projects              ?? 0,
        activeSubscribers:   raw.activeSubscribers   ?? raw.newsletterSubscribers ?? 0,
        activeJobs:          raw.activeJobs          ?? 0,
        newAppsThisWeek:     raw.newAppsThisWeek     ?? raw.newApplicationsThisWeek ?? 0,
        newAppsThisMonth:    raw.newAppsThisMonth    ?? 0,
        byStatus: raw.byStatus ?? { pending: 0, reviewed: 0, interviewed: 0, accepted: 0, rejected: 0 },
        monthlyApplications: raw.monthlyApplications ?? raw.monthlyVisits ?? [],
        monthLabels: raw.monthLabels ?? ['Jun','Jul','Aoû','Sep','Oct','Nov','Déc','Jan','Fév','Mar','Avr','Mai'],
      };

      setStats(normalized);
      setApps(Array.isArray(aData) ? aData : []);
      setArticles(Array.isArray(artData.articles) ? artData.articles : []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const statCards = stats ? [
    { label: 'Total candidatures', value: stats.totalApplications, sub: `+${stats.newAppsThisMonth} ce mois`,              icon: Users,     dark: true  },
    { label: 'Articles publiés',   value: stats.publishedArticles, sub: `${stats.publishedProjects} projets`,               icon: FileText,  dark: false },
    { label: "Offres d'emploi",    value: stats.activeJobs,        sub: 'offres actives',                                   icon: Briefcase, dark: false },
    { label: 'Abonnés newsletter', value: stats.activeSubscribers, sub: `${stats.newAppsThisWeek} candidats cette semaine`, icon: Eye,       dark: false },
  ] : [];

  const chartData   = stats?.monthlyApplications ?? [];
  const chartLabels = stats?.monthLabels ?? [];
  const maxVal      = Math.max(...chartData, 1);
  const today       = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <RefreshCw size={32} color="var(--brand)" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Chargement des données…</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
      <p style={{ color: '#ef4444', fontSize: 14 }}>⚠ {error}</p>
      <button onClick={fetchAll} style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
        Réessayer
      </button>
    </div>
  );

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      padding: '28px 32px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: 'var(--fg)',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: -0.8, color: 'var(--fg)' }}>
              Vue d'ensemble
            </h1>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0, textTransform: 'capitalize' }}>
              {today}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={fetchAll}
              style={{
                background: 'var(--bg-2)', color: 'var(--fg)',
                border: '1.5px solid var(--border)',
                borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <RefreshCw size={13} /> Actualiser
            </button>
            <a href="/admin/articles" style={{
              background: 'var(--brand)', color: '#fff',
              borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)', textDecoration: 'none',
            }}>
              <Plus size={14} /> Nouvel article
            </a>
          </div>
        </div>

        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <pattern id="hatch-light" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" />
            </pattern>
            <pattern id="hatch-dark" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
            </pattern>
          </defs>
        </svg>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {statCards.map((s, i) => {
            const isDark = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                style={{
                  borderRadius: 20, padding: '22px 24px',
                  boxShadow: isDark ? '0 8px 32px rgba(99,102,241,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  position: 'relative', overflow: 'hidden', cursor: 'default',
                  border: isDark ? 'none' : '1px solid var(--border)',
                  background: isDark ? 'var(--brand)' : 'var(--bg-2)',
                  transition: 'transform .2s, box-shadow .2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = isDark
                    ? '0 12px 40px rgba(99,102,241,0.4)'
                    : '0 4px 16px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = isDark
                    ? '0 8px 32px rgba(99,102,241,0.25)'
                    : '0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 20 }} preserveAspectRatio="xMidYMid slice">
                  <rect width="100%" height="100%" fill={`url(#${isDark ? 'hatch-dark' : 'hatch-light'})`} />
                </svg>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Label + flèche */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600, lineHeight: 1.3, maxWidth: '70%',
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--fg-muted)',
                    }}>
                      {s.label}
                    </span>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg)',
                    }}>
                      <ArrowUpRight size={14} color={isDark ? 'rgba(255,255,255,0.7)' : 'var(--fg-muted)'} />
                    </div>
                  </div>

                  <div style={{
                    fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: -1,
                    color: isDark ? 'var(--electric)' : 'var(--fg)',
                  }}>
                    {s.value}
                  </div>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.10)',
                    borderRadius: 99, padding: '4px 10px', width: 'fit-content',
                  }}>
                    <TrendingUp size={10} color={isDark ? 'var(--electric)' : 'var(--brand)'} />
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: isDark ? 'var(--electric)' : 'var(--brand)',
                    }}>
                      {s.sub}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>

          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--fg)' }}>
                  Analyses de performance
                </h2>
                <p style={{ fontSize: 11, color: 'var(--fg-muted)', margin: '3px 0 0' }}>
                  Candidatures · 12 mois glissants
                </p>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(99,102,241,0.12)', color: 'var(--brand)',
                fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 99,
              }}>
                Total : {stats?.totalApplications ?? 0}
              </span>
            </div>

            {(() => {
              const W = 580, H = 160;
              const n = chartData.length || 12;
              const gap = 10;
              const barW = Math.floor((W - gap * (n - 1)) / n);
              const r = barW / 2;

              return (
                <div style={{ width: '100%', overflowX: 'hidden' }}>
                  <svg viewBox={`0 0 ${W} ${H + 22}`} width="100%" style={{ display: 'block' }}>
                    <defs>
                      <pattern id="bar-hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(-45)">
                        <line x1="0" y1="0" x2="0" y2="7" stroke="var(--border)" strokeWidth="2" />
                      </pattern>
                    </defs>

                    {chartData.map((v, i) => {
                      const x      = i * (barW + gap);
                      const pct    = v / maxVal;
                      const barH   = Math.max(pct * H, r * 2 + 2);
                      const y      = H - barH;
                      const isLast = i === chartData.length - 1;
                      const isPrev = i === chartData.length - 2;
                      const fill   = isLast
                        ? 'var(--brand)'
                        : isPrev
                        ? 'var(--brand-light)'
                        : 'url(#bar-hatch)';

                      return (
                        <g key={i}>
                          {(isLast || isPrev) && v > 0 && (
                            <text
                              x={x + barW / 2} y={y - 5}
                              textAnchor="middle" fontSize="10" fontWeight="700"
                              fill={isLast ? 'var(--brand)' : 'var(--brand-light)'}
                            >
                              {v}
                            </text>
                          )}

                          <motion.rect
                            key={`bar-${i}`}
                            x={x} y={y} width={barW} height={barH}
                            rx={r} ry={r}
                            fill={fill}
                            stroke={(!isLast && !isPrev) ? 'var(--border)' : 'none'}
                            strokeWidth={(!isLast && !isPrev) ? 1.5 : 0}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: i * 0.045, duration: 0.5, ease: 'easeOut' }}
                            style={{ transformOrigin: `${x + barW / 2}px ${H}px` }}
                          />

                          <text
                            x={x + barW / 2} y={H + 16}
                            textAnchor="middle" fontSize="9"
                            fontWeight={isLast ? '700' : '400'}
                            fill={isLast ? 'var(--brand)' : 'var(--fg-muted)'}
                          >
                            {chartLabels[i] ?? ''}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}
          </div>

          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px 22px',
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: 'var(--fg)' }}>
              Répartition candidatures
            </h2>
            {stats && [
              { label: 'En attente', count: stats.byStatus?.pending     ?? 0, dot: '#f59e0b'              },
              { label: 'Examinées',  count: stats.byStatus?.reviewed    ?? 0, dot: 'var(--brand-light)'  },
              { label: 'Entretien',  count: stats.byStatus?.interviewed ?? 0, dot: 'var(--accent)'       },
              { label: 'Acceptées',  count: stats.byStatus?.accepted    ?? 0, dot: '#10b981'              },
              { label: 'Refusées',   count: stats.byStatus?.rejected    ?? 0, dot: '#ef4444'              },
            ].map((item, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg)' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>

          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--fg)' }}>Candidatures récentes</h2>
              <a href="/admin/applications" style={{
                fontSize: 12, color: 'var(--brand)', textDecoration: 'none', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                Voir tout <ArrowUpRight size={12} />
              </a>
            </div>

            {apps.length === 0 ? (
              <p style={{ color: 'var(--fg-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                Aucune candidature enregistrée.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Candidat', 'Poste', 'Date', 'Statut', 'CV'].map(h => (
                      <th key={h} style={{
                        paddingBottom: 10, paddingRight: 14, textAlign: 'left',
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: 'var(--fg-muted)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 5).map((app, i) => {
                    const st  = STATUS_CFG[app.status] ?? STATUS_CFG.pending;
                    const pos = app.jobPosition || app.job?.title || '—';
                    return (
                      <tr
                        key={app.id}
                        style={{ borderBottom: i < Math.min(apps.length, 5) - 1 ? '1px solid var(--border)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 14px 12px 0' }}>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--fg)' }}>
                            {app.firstName} {app.lastName}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: 'var(--fg-muted)' }}>{app.email}</p>
                        </td>
                        <td style={{
                          padding: '12px 14px 12px 0', color: 'var(--fg-muted)',
                          fontSize: 12, maxWidth: 140, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {pos}
                        </td>
                        <td style={{ padding: '12px 14px 12px 0', fontSize: 11, color: 'var(--fg-muted)' }}>
                          {app.createdAt ? format(parseISO(app.createdAt), 'd MMM yyyy', { locale: fr }) : '—'}
                        </td>
                        <td style={{ padding: '12px 14px 12px 0' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: st.bg, color: st.color,
                            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 0' }}>
                          {app.cvPath ? (
                            <a
                              href={`${API}/${app.cvPath}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{
                                background: 'rgba(99,102,241,0.12)', border: 'none', borderRadius: 8,
                                padding: '6px 8px', cursor: 'pointer', color: 'var(--brand)',
                                display: 'inline-flex', alignItems: 'center',
                              }}
                            >
                              <Download size={13} />
                            </a>
                          ) : (
                            <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--fg)' }}>Articles récents</h2>
              <a href="/admin/articles" style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                textDecoration: 'none', color: 'var(--fg)',
              }}>
                <Plus size={11} /> Nouveau
              </a>
            </div>

            {articles.length === 0 ? (
              <p style={{ color: 'var(--fg-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                Aucun article.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {articles.map((a, i) => {
                  const iconBgs = [
                    'rgba(99,102,241,0.15)',
                    'rgba(239,68,68,0.15)',
                    'rgba(139,92,246,0.20)',
                    'rgba(245,158,11,0.15)',
                    'rgba(99,102,241,0.10)',
                  ];
                  const iconColors = [
                    'var(--brand)',
                    '#ef4444',
                    'var(--accent)',
                    '#d97706',
                    'var(--brand-light)',
                  ];
                  return (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '6px 8px', borderRadius: 10, cursor: 'pointer', transition: 'background .15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: iconBgs[i % 5],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FileText size={14} color={iconColors[i % 5]} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--fg)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {a.title}
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: 'var(--fg-muted)', marginTop: 1 }}>
                          {(a.views ?? 0).toLocaleString()} vues · {a.likes ?? 0} likes
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                          background: a.type === 'blog'
                            ? 'rgba(99,102,241,0.12)'
                            : a.type === 'news'
                            ? 'rgba(245,158,11,0.12)'
                            : 'rgba(239,68,68,0.12)',
                          color: a.type === 'blog'
                            ? 'var(--brand)'
                            : a.type === 'news'
                            ? '#d97706'
                            : '#ef4444',
                          padding: '2px 8px', borderRadius: 99,
                        }}>
                          {a.type === 'blog' ? 'Article' : a.type === 'news' ? 'Actu' : 'Job'}
                        </span>
                        {!a.published && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#d97706' }}>Brouillon</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}