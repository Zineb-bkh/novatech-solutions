'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Smartphone, Brain, Cloud, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/data';

const ICON_MAP: Record<string, any> = { Globe, Smartphone, Brain, Cloud, Shield };

export default function ServicesPage() {
  return (
    <div className="pt-16">

      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="badge badge-primary mb-6">Nos expertises</span>
          <h1 className="font-display font-bold text-5xl md:text-6xl mb-4" style={{ color: 'var(--fg)' }}>
            Des solutions pour chaque <span className="gradient-text">défi tech</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
            De la stratégie à la livraison, nous couvrons l'intégralité du spectre technologique.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon];
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
               
                <div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: service.gradient }}>
                    {Icon && <Icon className="w-7 h-7 text-white" />}
                  </div>
                  <h2 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: 'var(--fg)' }}>
                    {service.title}
                  </h2>
                  <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--fg-muted)' }}>
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm" style={{ color: 'var(--fg)' }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.technologies.map(t => (
                      <span key={t} className="badge badge-primary">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <Link href="/contact" className="btn btn-primary">
                      Démarrer <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-sm font-semibold" style={{ color: 'var(--fg-muted)' }}>
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--fg-muted)' }}>
                    Cas d'usage
                  </p>
                  {service.useCases.map((uc, ui) => (
                    <div key={ui} className="card p-5">
                      <h4 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>{uc.title}</h4>
                      <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>{uc.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-4xl mb-6" style={{ color: 'var(--fg)' }}>
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--fg-muted)' }}>
            Contactez-nous pour un audit gratuit de votre besoin. Réponse garantie sous 24h.
          </p>
          <Link href="/contact" className="btn btn-primary text-base px-8 py-4">
            Demander un devis gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
