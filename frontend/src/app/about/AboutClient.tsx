'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TEAM, VALUES, COMPANY } from '@/lib/data';
import { ArrowRight, Linkedin, Twitter, Zap, Target, Eye, Heart, Lightbulb, Users, Shield, Globe } from 'lucide-react';

const ICON_MAP: Record<string, any> = { Zap, Target, Eye, Heart, Lightbulb, Users, Shield, Globe };

const TIMELINE = [
  { year: '2018', title: 'Fondation', desc: 'NovaTech naît dans un petit bureau de Casablanca avec 3 associés et une grande ambition.' },
  { year: '2019', title: 'Premier grand compte', desc: 'Signature d\'un contrat majeur avec un groupe bancaire pour moderniser leur SI.' },
  { year: '2020', title: 'Pivot AI', desc: 'Création de la practice Data Science & IA, anticipant la vague des LLMs.' },
  { year: '2021', title: '50 collaborateurs', desc: 'L\'équipe franchit le cap des 50 experts. Ouverture de nouveaux bureaux à Rabat.' },
  { year: '2022', title: 'Certification AWS', desc: 'Obtention du statut AWS Advanced Consulting Partner.' },
  { year: '2023', title: '500 projets', desc: 'Cap des 500 projets livrés. Lancement du programme NovaTech Academy.' },
  { year: '2024', title: 'Expansion MENA', desc: 'Ouverture du bureau de Dubaï. Expansion vers les marchés Golfe et Afrique.' },
];

export default function AboutClient() {
  return (
    <div className="pt-16">
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-primary mb-6">Notre histoire</span>
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6" style={{ color: 'var(--fg)' }}>
              Construire le futur,{' '}
              <span className="gradient-text">un projet à la fois</span>
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Fondée en 2018 à Casablanca, NovaTech Solutions est née d'une conviction simple : les entreprises africaines méritent des solutions technologiques de niveau mondial.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-y border-[var(--border)]" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2018', label: 'Fondée en' },
              { value: '50+', label: 'Experts' },
              { value: '500+', label: 'Projets livrés' },
              { value: '150+', label: 'Clients satisfaits' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-bold text-3xl gradient-text">{s.value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-primary mb-4">Notre raison d'être</span>
              <h2 className="font-display font-bold text-4xl mb-6" style={{ color: 'var(--fg)' }}>
                Mission & Vision
              </h2>
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(79,70,229,0.1)' }}>
                      <Target className="w-4 h-4 text-brand-500" />
                    </div>
                    <h3 className="font-display font-bold" style={{ color: 'var(--fg)' }}>Mission</h3>
                  </div>
                  <p style={{ color: 'var(--fg-muted)' }}>
                    Accélérer la transformation digitale des entreprises africaines et MENA en leur fournissant des solutions technologiques de classe mondiale, adaptées à leurs réalités locales.
                  </p>
                </div>
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
                      <Eye className="w-4 h-4 text-accent-500" />
                    </div>
                    <h3 className="font-display font-bold" style={{ color: 'var(--fg)' }}>Vision</h3>
                  </div>
                  <p style={{ color: 'var(--fg-muted)' }}>
                    Devenir le partenaire tech de référence pour les entreprises ambitieuses du continent africain, et positionner le Maroc comme hub d'innovation technologique au niveau mondial.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} />
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {VALUES.map((v, i) => {
                    const Icon = ICON_MAP[v.icon] || Zap;
                    return (
                      <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-2)' }}>
                        <Icon className="w-5 h-5 mb-2 text-brand-500" />
                        <div className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--fg)' }}>{v.title}</div>
                        <div className="text-xs" style={{ color: 'var(--fg-muted)' }}>{v.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4">Chronologie</span>
            <h2 className="font-display font-bold text-4xl" style={{ color: 'var(--fg)' }}>Notre parcours</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-8 items-start pl-20 relative"
                >
                  <div className="absolute left-4 top-1 w-8 h-8 rounded-full border-2 border-brand-500 bg-[var(--bg)] flex items-center justify-center -translate-x-1/2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  </div>
                  <div>
                    <span className="badge badge-primary text-xs mb-2">{item.year}</span>
                    <h3 className="font-display font-bold text-lg" style={{ color: 'var(--fg)' }}>{item.title}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4">L'équipe</span>
            <h2 className="font-display font-bold text-4xl" style={{ color: 'var(--fg)' }}>
              Les experts derrière NovaTech
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 text-center group"
              >
                <div className="relative mb-4 inline-block">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-2xl mx-auto group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-display font-bold text-lg" style={{ color: 'var(--fg)' }}>{member.name}</h3>
                <p className="text-sm text-brand-500 mb-3">{member.role}</p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>{member.bio}</p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {member.skills.map(s => (
                    <span key={s} className="badge badge-primary text-[10px]">{s}</span>
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  <a href={member.linkedin} className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-all" style={{ color: 'var(--fg-muted)' }}>
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a href={member.twitter} className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-all" style={{ color: 'var(--fg-muted)' }}>
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-4xl mb-6" style={{ color: 'var(--fg)' }}>
            Rejoignez l'aventure NovaTech
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--fg-muted)' }}>
            Nous recrutons des talents passionnés. Découvrez nos offres d'emploi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog?type=job" className="btn btn-primary">
              Voir les offres d'emploi <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}