'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Mail, Phone, MapPin, Shield, Bell, Palette,
  Database, Key, Eye, EyeOff, Save, Upload, Trash2,
  CheckCircle, AlertCircle, Zap, Building2, Link2,
  Lock, Users, ToggleLeft, ToggleRight, RefreshCw,
  Server, Webhook, Languages, Clock, Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'general' | 'security' | 'notifications' | 'appearance' | 'integrations' | 'advanced';

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? 'bg-gradient-to-r from-brand-600 to-accent-600' : 'bg-[var(--border)]'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium" style={{ color: 'var(--fg)' }}>{label}</label>
    {children}
    {hint && <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>{hint}</p>}
  </div>
);

const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200
      focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)]
      bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    rows={3}
    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200
      focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] resize-none
      bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] ${className}`}
    {...props}
  />
);

const Select = ({ children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200
      focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)]
      bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] ${className}`}
    {...props}
  >
    {children}
  </select>
);

const SectionCard = ({ title, description, icon: Icon, children }: {
  title: string; description?: string; icon?: React.ElementType; children: React.ReactNode;
}) => (
  <div className="card p-6 space-y-5" style={{ background: 'var(--card-bg)' }}>
    {(title || description) && (
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 flex items-center justify-center flex-shrink-0">
            <Icon size={18} style={{ color: 'var(--brand)' }} />
          </div>
        )}
        <div>
          <h3 className="font-display font-semibold text-base" style={{ color: 'var(--fg)' }}>{title}</h3>
          {description && <p className="text-sm mt-0.5" style={{ color: 'var(--fg-muted)' }}>{description}</p>}
        </div>
      </div>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

const RowToggle = ({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
    <div>
      <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{label}</p>
      {description && <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>{description}</p>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [general, setGeneral] = useState({
    siteName: 'NovaTech Solutions',
    tagline: 'Transforming Digital Vision Into Reality',
    description: 'NovaTech Solutions delivers cutting-edge software development, AI, cloud computing, and cybersecurity services for ambitious businesses.',
    email: 'contact@novatech.solutions',
    phone: '+212 6 00 00 00 00',
    address: 'Casablanca, Maroc',
    website: 'https://novatech.solutions',
    logo: '',
    language: 'fr',
    timezone: 'Africa/Casablanca',
    currency: 'MAD',
    maintenanceMode: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '60',
    allowRegistration: false,
    jwtSecret: 'nt_sk_**************************',
    maxLoginAttempts: '5',
    ipWhitelist: '',
  });

  const [notifs, setNotifs] = useState({
    newApplication: true,
    newContact: true,
    newsletterSignup: false,
    weeklyReport: true,
    systemAlerts: true,
    emailFrom: 'noreply@novatech.solutions',
    smtpHost: 'smtp.mailtrap.io',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
  });

  const [appearance, setAppearance] = useState({
    primaryColor: '#4f46e5',
    accentColor: '#7c3aed',
    defaultTheme: 'system',
    showChatbot: true,
    showNewsletter: true,
    animationsEnabled: true,
    fontDisplay: 'Syne',
    fontBody: 'DM Sans',
  });

  const [integrations, setIntegrations] = useState({
    googleAnalytics: '',
    googleTagManager: '',
    linkedinPage: 'https://linkedin.com/company/novatech',
    twitterHandle: '@novatech_ma',
    githubOrg: 'novatech-solutions',
    webhookUrl: '',
    webhookEnabled: false,
  });

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'integrations', label: 'Intégrations', icon: Link2 },
    { id: 'advanced', label: 'Avancé', icon: Server },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    toast.success('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--fg)' }}>Paramètres</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            Configurez votre plateforme NovaTech Solutions
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)' }}
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="lg:w-56 flex-shrink-0">
          <nav className="card p-2 space-y-1" style={{ background: 'var(--card-bg)' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                    active
                      ? 'text-white shadow-sm'
                      : 'hover:bg-[var(--bg-2)]'
                  }`}
                  style={active ? { background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)', color: 'white' } : { color: 'var(--fg-muted)' }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >

              {activeTab === 'general' && (
                <>
                  <SectionCard title="Informations du site" description="Identité et coordonnées de la plateforme" icon={Building2}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Nom du site">
                        <Input value={general.siteName} onChange={e => setGeneral(p => ({ ...p, siteName: e.target.value }))} />
                      </Field>
                      <Field label="Slogan">
                        <Input value={general.tagline} onChange={e => setGeneral(p => ({ ...p, tagline: e.target.value }))} />
                      </Field>
                    </div>
                    <Field label="Description" hint="Utilisée pour le SEO (meta description)">
                      <Textarea value={general.description} onChange={e => setGeneral(p => ({ ...p, description: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Email de contact">
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--fg-muted)' }} />
                          <Input className="pl-9" value={general.email} onChange={e => setGeneral(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      </Field>
                      <Field label="Téléphone">
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--fg-muted)' }} />
                          <Input className="pl-9" value={general.phone} onChange={e => setGeneral(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                      </Field>
                      <Field label="Adresse">
                        <div className="relative">
                          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--fg-muted)' }} />
                          <Input className="pl-9" value={general.address} onChange={e => setGeneral(p => ({ ...p, address: e.target.value }))} />
                        </div>
                      </Field>
                      <Field label="URL du site">
                        <div className="relative">
                          <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--fg-muted)' }} />
                          <Input className="pl-9" value={general.website} onChange={e => setGeneral(p => ({ ...p, website: e.target.value }))} />
                        </div>
                      </Field>
                    </div>
                  </SectionCard>

                  <SectionCard title="Logo & Médias" icon={ImageIcon}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
                        <Zap size={24} style={{ color: 'var(--brand)' }} />
                      </div>
                      <div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:bg-[var(--bg-2)]" style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}>
                          <Upload size={14} /> Importer un logo
                        </button>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--fg-muted)' }}>PNG, SVG — max 2 Mo. Taille recommandée : 512×512px</p>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="Régionalisation" icon={Languages}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Langue par défaut">
                        <Select value={general.language} onChange={e => setGeneral(p => ({ ...p, language: e.target.value }))}>
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                        </Select>
                      </Field>
                      <Field label="Fuseau horaire">
                        <Select value={general.timezone} onChange={e => setGeneral(p => ({ ...p, timezone: e.target.value }))}>
                          <option value="Africa/Casablanca">Africa/Casablanca (UTC+1)</option>
                          <option value="Europe/Paris">Europe/Paris (UTC+2)</option>
                          <option value="UTC">UTC</option>
                        </Select>
                      </Field>
                      <Field label="Devise">
                        <Select value={general.currency} onChange={e => setGeneral(p => ({ ...p, currency: e.target.value }))}>
                          <option value="MAD">MAD — Dirham marocain</option>
                          <option value="EUR">EUR — Euro</option>
                          <option value="USD">USD — Dollar US</option>
                        </Select>
                      </Field>
                    </div>
                  </SectionCard>

                  <SectionCard title="Mode maintenance" icon={Clock} description="Affiche une page de maintenance aux visiteurs pendant les mises à jour">
                    <RowToggle
                      label="Activer le mode maintenance"
                      description="Seuls les administrateurs pourront accéder au site"
                      checked={general.maintenanceMode}
                      onChange={v => setGeneral(p => ({ ...p, maintenanceMode: v }))}
                    />
                    {general.maintenanceMode && (
                      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-600 dark:text-amber-400">Le mode maintenance est activé. Les visiteurs voient une page d'indisponibilité.</p>
                      </div>
                    )}
                  </SectionCard>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <SectionCard title="Authentification" icon={Lock}>
                    <RowToggle
                      label="Authentification à deux facteurs (2FA)"
                      description="Ajoute une couche de sécurité supplémentaire à la connexion admin"
                      checked={security.twoFactor}
                      onChange={v => setSecurity(p => ({ ...p, twoFactor: v }))}
                    />
                    <RowToggle
                      label="Autoriser l'inscription publique"
                      description="Permet aux utilisateurs de créer un compte via l'interface publique"
                      checked={security.allowRegistration}
                      onChange={v => setSecurity(p => ({ ...p, allowRegistration: v }))}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <Field label="Expiration de session (minutes)" hint="0 = pas d'expiration automatique">
                        <Input type="number" value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} />
                      </Field>
                      <Field label="Tentatives de connexion max">
                        <Input type="number" value={security.maxLoginAttempts} onChange={e => setSecurity(p => ({ ...p, maxLoginAttempts: e.target.value }))} />
                      </Field>
                    </div>
                  </SectionCard>

                  <SectionCard title="Clé secrète JWT" icon={Key} description="Utilisée pour signer les tokens d'authentification">
                    <Field label="JWT Secret" hint="Changez cette clé pour invalider toutes les sessions actives">
                      <div className="relative">
                        <Input
                          type={showSecret ? 'text' : 'password'}
                          value={security.jwtSecret}
                          onChange={e => setSecurity(p => ({ ...p, jwtSecret: e.target.value }))}
                          className="pr-20 font-mono text-xs"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button onClick={() => setShowSecret(p => !p)} className="p-1.5 rounded-lg hover:bg-[var(--bg-2)] transition-colors">
                            {showSecret ? <EyeOff size={14} style={{ color: 'var(--fg-muted)' }} /> : <Eye size={14} style={{ color: 'var(--fg-muted)' }} />}
                          </button>
                          <button
                            onClick={() => { setSecurity(p => ({ ...p, jwtSecret: 'nt_sk_' + Math.random().toString(36).slice(2, 30) })); toast('Nouvelle clé générée — sauvegardez !'); }}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-2)] transition-colors"
                          >
                            <RefreshCw size={14} style={{ color: 'var(--fg-muted)' }} />
                          </button>
                        </div>
                      </div>
                    </Field>
                  </SectionCard>

                  <SectionCard title="Liste blanche IP" icon={Shield} description="Restreindre l'accès admin à des IPs spécifiques (une par ligne)">
                    <Field label="IPs autorisées" hint="Laissez vide pour autoriser toutes les IPs">
                      <Textarea
                        placeholder={'127.0.0.1\n192.168.1.0/24'}
                        value={security.ipWhitelist}
                        onChange={e => setSecurity(p => ({ ...p, ipWhitelist: e.target.value }))}
                      />
                    </Field>
                  </SectionCard>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <SectionCard title="Alertes email" icon={Bell} description="Choisissez quand recevoir des notifications par email">
                    <RowToggle label="Nouvelle candidature" description="Email à chaque nouvelle candidature soumise" checked={notifs.newApplication} onChange={v => setNotifs(p => ({ ...p, newApplication: v }))} />
                    <RowToggle label="Nouveau message de contact" description="Email à chaque formulaire de contact reçu" checked={notifs.newContact} onChange={v => setNotifs(p => ({ ...p, newContact: v }))} />
                    <RowToggle label="Inscription newsletter" description="Email à chaque nouvel abonné newsletter" checked={notifs.newsletterSignup} onChange={v => setNotifs(p => ({ ...p, newsletterSignup: v }))} />
                    <RowToggle label="Rapport hebdomadaire" description="Résumé des activités chaque lundi matin" checked={notifs.weeklyReport} onChange={v => setNotifs(p => ({ ...p, weeklyReport: v }))} />
                    <RowToggle label="Alertes système" description="Notifications d'erreurs serveur et performances" checked={notifs.systemAlerts} onChange={v => setNotifs(p => ({ ...p, systemAlerts: v }))} />
                  </SectionCard>

                  <SectionCard title="Configuration SMTP" icon={Mail} description="Serveur d'envoi des emails de notification">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Adresse expéditeur">
                        <Input value={notifs.emailFrom} onChange={e => setNotifs(p => ({ ...p, emailFrom: e.target.value }))} />
                      </Field>
                      <Field label="Hôte SMTP">
                        <Input value={notifs.smtpHost} onChange={e => setNotifs(p => ({ ...p, smtpHost: e.target.value }))} />
                      </Field>
                      <Field label="Port SMTP">
                        <Input type="number" value={notifs.smtpPort} onChange={e => setNotifs(p => ({ ...p, smtpPort: e.target.value }))} />
                      </Field>
                      <Field label="Utilisateur SMTP">
                        <Input value={notifs.smtpUser} onChange={e => setNotifs(p => ({ ...p, smtpUser: e.target.value }))} placeholder="user@smtp.io" />
                      </Field>
                      <Field label="Mot de passe SMTP">
                        <Input type="password" value={notifs.smtpPass} onChange={e => setNotifs(p => ({ ...p, smtpPass: e.target.value }))} placeholder="••••••••" />
                      </Field>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:bg-[var(--bg-2)]" style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}>
                      <Mail size={14} /> Envoyer un email test
                    </button>
                  </SectionCard>
                </>
              )}

              {activeTab === 'appearance' && (
                <>
                  <SectionCard title="Couleurs" icon={Palette} description="Palette de couleurs de la plateforme">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Couleur principale (brand)">
                        <div className="flex items-center gap-3">
                          <input type="color" value={appearance.primaryColor} onChange={e => setAppearance(p => ({ ...p, primaryColor: e.target.value }))}
                            className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)' }} />
                          <Input value={appearance.primaryColor} onChange={e => setAppearance(p => ({ ...p, primaryColor: e.target.value }))} className="font-mono" />
                        </div>
                      </Field>
                      <Field label="Couleur accentuée">
                        <div className="flex items-center gap-3">
                          <input type="color" value={appearance.accentColor} onChange={e => setAppearance(p => ({ ...p, accentColor: e.target.value }))}
                            className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)' }} />
                          <Input value={appearance.accentColor} onChange={e => setAppearance(p => ({ ...p, accentColor: e.target.value }))} className="font-mono" />
                        </div>
                      </Field>
                    </div>
                  </SectionCard>

                  <SectionCard title="Typographie" icon={Palette}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Police des titres">
                        <Select value={appearance.fontDisplay} onChange={e => setAppearance(p => ({ ...p, fontDisplay: e.target.value }))}>
                          <option value="Syne">Syne</option>
                          <option value="Cabinet Grotesk">Cabinet Grotesk</option>
                          <option value="Clash Display">Clash Display</option>
                        </Select>
                      </Field>
                      <Field label="Police du corps">
                        <Select value={appearance.fontBody} onChange={e => setAppearance(p => ({ ...p, fontBody: e.target.value }))}>
                          <option value="DM Sans">DM Sans</option>
                          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                          <option value="Nunito">Nunito</option>
                        </Select>
                      </Field>
                    </div>
                  </SectionCard>

                  <SectionCard title="Thème par défaut" icon={Palette}>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'system'].map(t => (
                        <button
                          key={t}
                          onClick={() => setAppearance(p => ({ ...p, defaultTheme: t }))}
                          className={`p-4 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${appearance.defaultTheme === t ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--bg-2)]'}`}
                          style={appearance.defaultTheme === t ? { background: 'rgba(79,70,229,0.08)' } : {}}
                        >
                          {t === 'light' ? ' Clair' : t === 'dark' ? ' Sombre' : ' Système'}
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Composants" icon={Zap}>
                    <RowToggle label="Chatbot IA" description="Afficher le chatbot assistant sur les pages publiques" checked={appearance.showChatbot} onChange={v => setAppearance(p => ({ ...p, showChatbot: v }))} />
                    <RowToggle label="Bloc newsletter" description="Afficher le formulaire d'inscription newsletter" checked={appearance.showNewsletter} onChange={v => setAppearance(p => ({ ...p, showNewsletter: v }))} />
                    <RowToggle label="Animations" description="Activer les animations de page (Framer Motion)" checked={appearance.animationsEnabled} onChange={v => setAppearance(p => ({ ...p, animationsEnabled: v }))} />
                  </SectionCard>
                </>
              )}

              {activeTab === 'integrations' && (
                <>
                  <SectionCard title="Analytics & Tracking" icon={Link2} description="Connectez vos outils d'analyse web">
                    <Field label="Google Analytics ID" hint="Format : G-XXXXXXXXXX">
                      <Input value={integrations.googleAnalytics} placeholder="G-XXXXXXXXXX" onChange={e => setIntegrations(p => ({ ...p, googleAnalytics: e.target.value }))} />
                    </Field>
                    <Field label="Google Tag Manager ID" hint="Format : GTM-XXXXXXX">
                      <Input value={integrations.googleTagManager} placeholder="GTM-XXXXXXX" onChange={e => setIntegrations(p => ({ ...p, googleTagManager: e.target.value }))} />
                    </Field>
                  </SectionCard>

                  <SectionCard title="Réseaux sociaux" icon={Globe}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Page LinkedIn">
                        <Input value={integrations.linkedinPage} onChange={e => setIntegrations(p => ({ ...p, linkedinPage: e.target.value }))} placeholder="https://linkedin.com/company/..." />
                      </Field>
                      <Field label="Twitter / X">
                        <Input value={integrations.twitterHandle} onChange={e => setIntegrations(p => ({ ...p, twitterHandle: e.target.value }))} placeholder="@handle" />
                      </Field>
                      <Field label="Organisation GitHub">
                        <Input value={integrations.githubOrg} onChange={e => setIntegrations(p => ({ ...p, githubOrg: e.target.value }))} placeholder="mon-org" />
                      </Field>
                    </div>
                  </SectionCard>

                  <SectionCard title="Webhook" icon={Webhook} description="Recevez des événements en temps réel dans votre système">
                    <RowToggle label="Activer le webhook" description="Envoyer les événements (candidatures, contacts) à une URL externe" checked={integrations.webhookEnabled} onChange={v => setIntegrations(p => ({ ...p, webhookEnabled: v }))} />
                    {integrations.webhookEnabled && (
                      <Field label="URL du webhook" hint="POST — JSON payload avec type et données">
                        <Input value={integrations.webhookUrl} placeholder="https://..." onChange={e => setIntegrations(p => ({ ...p, webhookUrl: e.target.value }))} />
                      </Field>
                    )}
                  </SectionCard>
                </>
              )}

              {activeTab === 'advanced' && (
                <>
                  <SectionCard title="Base de données" icon={Database} description="Informations sur la connexion à la base de données">
                    <div className="rounded-xl p-4 font-mono text-xs space-y-2" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                      {[
                        ['Hôte', 'localhost'],
                        ['Base', 'novatech_db'],
                        ['Dialect', 'SQLite'],
                        ['Statut', ' Connecté'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span style={{ color: 'var(--fg-muted)' }}>{k}</span>
                          <span style={{ color: 'var(--fg)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Variables d'environnement" icon={Server} description="Variables actives détectées depuis .env">
                    <div className="space-y-2">
                      {[
                        { key: 'NEXT_PUBLIC_API_URL', val: 'http://localhost:5000', set: true },
                        { key: 'JWT_SECRET', val: '••••••••••••', set: true },
                        { key: 'DATABASE_URL', val: './database.sqlite', set: true },
                        { key: 'SMTP_HOST', val: 'smtp.mailtrap.io', set: true },
                        { key: 'GOOGLE_ANALYTICS_ID', val: 'Non défini', set: false },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-2)' }}>
                          <code className="text-xs font-mono" style={{ color: 'var(--brand)' }}>{item.key}</code>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono" style={{ color: 'var(--fg-muted)' }}>{item.val}</span>
                            {item.set
                              ? <CheckCircle size={13} className="text-green-500" />
                              : <AlertCircle size={13} className="text-amber-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Danger Zone" icon={Trash2} description="Actions irréversibles — procédez avec précaution">
                    <div className="rounded-xl p-5 space-y-4" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.04)' }}>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-sm font-semibold text-red-600 dark:text-red-400">Vider le cache</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>Supprime tous les fichiers de cache Next.js</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                          Vider le cache
                        </button>
                      </div>
                      <hr style={{ borderColor: 'rgba(239,68,68,0.2)' }} />
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-sm font-semibold text-red-600 dark:text-red-400">Réinitialiser les paramètres</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>Restaure tous les paramètres par défaut</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
                          Réinitialiser
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}