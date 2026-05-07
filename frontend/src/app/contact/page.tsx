'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Calendar, Clock } from 'lucide-react';
import { COMPANY } from '@/lib/data';
import toast from 'react-hot-toast';

const SERVICES_LIST = ['Développement Web', 'Développement Mobile', 'IA & Data', 'Cloud & DevOps', 'Cybersécurité', 'Consulting IT', 'Autre'];
const BUDGETS = ['< 10 000 MAD', '10 000 – 50 000 MAD', '50 000 – 200 000 MAD', '200 000+ MAD'];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const EMPTY_FORM = { name: '', email: '', company: '', phone: '', service: '', budget: '', message: '' };

export default function ContactPage() {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur serveur');
      }

      setSent(true);
      toast.success('Message envoyé ! Nous vous répondrons sous 24h.', { icon: '✅', duration: 5000 });

    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue. Veuillez réessayer.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const INFO = [
    { icon: Mail,    label: 'Email',     value: COMPANY.email,   href: `mailto:${COMPANY.email}` },
    { icon: Phone,   label: 'Téléphone', value: COMPANY.phone,   href: `tel:${COMPANY.phone}` },
    { icon: MapPin,  label: 'Adresse',   value: COMPANY.address, href: '#' },
    { icon: Clock,   label: 'Heures',    value: 'Lun–Ven, 9h–18h', href: '#' },
  ];

  return (
    <div className="pt-16">
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="badge badge-primary mb-6">Contact</span>
          <h1 className="font-display font-bold text-5xl md:text-6xl mb-4" style={{ color: 'var(--fg)' }}>
            Parlons de votre <span className="gradient-text">projet</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
            Un appel de 30 minutes suffit pour transformer votre idée en feuille de route concrète.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-6" style={{ color: 'var(--fg)' }}>
                  Nos coordonnées
                </h2>
                <div className="space-y-4">
                  {INFO.map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} className="flex items-start gap-4 card p-4 hover:border-brand-500 transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(79,70,229,0.1)' }}>
                        <Icon className="w-5 h-5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--fg-muted)' }}>{label}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="card p-6" style={{ borderColor: 'rgba(79,70,229,0.3)', background: 'rgba(79,70,229,0.05)' }}>
                <Calendar className="w-6 h-6 text-brand-500 mb-3" />
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--fg)' }}>
                  Réserver un appel
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--fg-muted)' }}>
                  Préférez un appel rapide ? Choisissez un créneau directement dans notre agenda.
                </p>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full justify-center text-sm"
                >
                  <Calendar className="w-4 h-4" /> Choisir un créneau
                </a>
              </div>

              <div className="card overflow-hidden h-48" style={{ padding: 0 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.845!2d-7.6353!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2f8a9bf5c3f%3A0x1!2sTechnopark+Casablanca!5e0!3m2!1sfr!2sma!4v1000000000000"
                  width="100%"
                  height="192"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="card p-12 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="font-display font-bold text-3xl mb-3" style={{ color: 'var(--fg)' }}>
                    Message reçu !
                  </h3>
                  <p className="text-lg mb-6" style={{ color: 'var(--fg-muted)' }}>
                    Merci {form.name.split(' ')[0]} ! Notre équipe vous contactera dans les 24 heures.
                    <br />
                    <span className="text-sm">Un email de confirmation vous a été envoyé.</span>
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm(EMPTY_FORM); }}
                    className="btn btn-outline"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                  <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--fg)' }}>
                    Décrivez votre projet
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'name',    label: 'Nom complet *',  placeholder: 'Youssef Benali',       required: true },
                      { key: 'email',   label: 'Email *',         placeholder: 'you@company.com',      required: true, type: 'email' },
                      { key: 'company', label: 'Entreprise',      placeholder: 'Acme Corp' },
                      { key: 'phone',   label: 'Téléphone',       placeholder: '+212 6XX XXX XXX' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>{f.label}</label>
                        <input
                          type={f.type || 'text'}
                          required={f.required}
                          placeholder={f.placeholder}
                          value={(form as any)[f.key]}
                          onChange={e => update(f.key, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                          style={{ color: 'var(--fg)' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Service souhaité</label>
                      <select
                        value={form.service}
                        onChange={e => update('service', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        style={{ color: 'var(--fg)' }}
                      >
                        <option value="">Sélectionner...</option>
                        {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Budget estimé</label>
                      <select
                        value={form.budget}
                        onChange={e => update('budget', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        style={{ color: 'var(--fg)' }}
                      >
                        <option value="">Sélectionner...</option>
                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--fg)' }}>Décrivez votre projet *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      placeholder="Parlez-nous de votre projet, vos objectifs, vos contraintes..."
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      style={{ color: 'var(--fg)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full justify-center text-base py-3.5"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </span>
                    ) : (
                      <>Envoyer le message <Send className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-xs text-center" style={{ color: 'var(--fg-muted)' }}>
                    Vos données sont traitées de manière confidentielle. Réponse garantie sous 24h.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}