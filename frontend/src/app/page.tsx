'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Globe, Smartphone, Brain, Cloud, Shield, Star, ChevronRight, CheckCircle, Play } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { SERVICES, TESTIMONIALS, PARTNERS, PROJECTS } from '@/lib/data';

const ICON_MAP: Record<string, any> = { Globe, Smartphone, Brain, Cloud, Shield };

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
     
      <div className="absolute inset-0 bg-[var(--bg)]">
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl animate-blob"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-3/4 left-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl animate-blob animation-delay-4000"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
      </div>

      <motion.div style={{ y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
          style={{ background: 'rgba(79,70,229,0.1)', borderColor: 'rgba(79,70,229,0.3)', color: 'var(--brand-light)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold tracking-wider uppercase">Innovating Tomorrow's Solutions</span>
        </motion.div>

        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-bold leading-[1.05] mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            color: 'var(--fg)',
          }}
        >
          Transformez votre vision{' '}
          <span className="gradient-text block">digitale en réalité</span>
        </motion.h1>

        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--fg-muted)' }}
        >
          NovaTech livre des solutions logicielles de pointe propulsées par l'IA, le cloud et un design innovant.
          Nous aidons les entreprises ambitieuses à scaler et prospérer.
        </motion.p>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/contact" className="btn btn-primary text-base px-8 py-3.5">
            Démarrer un projet
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/portfolio" className="btn btn-outline text-base px-8 py-3.5">
            <Play className="w-4 h-4" />
            Voir nos réalisations
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { end: 500, suffix: '+', label: 'Projets livrés' },
            { end: 98, suffix: '%', label: 'Satisfaction client' },
            { end: 50, suffix: '+', label: 'Experts' },
          ].map((stat, i) => (
            <StatCounter key={i} {...stat} />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-9 rounded-full border-2 flex justify-center pt-1.5"
          style={{ borderColor: 'rgba(99,102,241,0.4)' }}>
          <div className="w-1 h-2 rounded-full animate-bounce"
            style={{ background: 'var(--brand)' }} />
        </div>
      </motion.div>
    </section>
  );
}

function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-bold text-3xl md:text-4xl gradient-text">
        {inView ? <CountUp end={end} duration={2} /> : '0'}{suffix}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>{label}</div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4">Nos expertises</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: 'var(--fg)' }}>
            Des solutions sur mesure pour chaque défi
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--fg-muted)' }}>
            De la stratégie à la livraison, nous couvrons l'intégralité du spectre technologique.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="card p-8 group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: service.gradient }}
                >
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--fg)' }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-muted)' }}>
                  {service.shortDesc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {service.technologies.slice(0, 4).map(t => (
                    <span key={t} className="badge badge-primary text-[10px]">{t}</span>
                  ))}
                </div>
                <Link
                  href={`/services#${service.id}`}
                  className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all"
                  style={{ color: 'var(--brand)' }}
                >
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const featured = PROJECTS.filter(p => p.featured).slice(0, 3);
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="badge badge-primary mb-4">Réalisations</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl" style={{ color: 'var(--fg)' }}>
              Projets qui font la différence
            </h2>
          </div>
          <Link href="/portfolio" className="hidden md:flex btn btn-outline">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 badge badge-primary capitalize">
                  {project.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--fg)' }}>
                  {project.title}
                </h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--fg-muted)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map(t => (
                    <span key={t} className="badge badge-primary text-[10px]">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-4">Témoignages</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl" style={{ color: 'var(--fg)' }}>
            Ce que disent nos clients
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative" style={{ minHeight: '250px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="card p-10 text-center"
              >
                
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: TESTIMONIALS[active].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg md:text-xl leading-relaxed mb-8 italic" style={{ color: 'var(--fg)' }}>
                  "{TESTIMONIALS[active].content}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={TESTIMONIALS[active].avatar}
                    alt={TESTIMONIALS[active].name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-display font-semibold" style={{ color: 'var(--fg)' }}>
                      {TESTIMONIALS[active].name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                      {TESTIMONIALS[active].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-8 bg-brand-500' : 'w-1.5 bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="py-16 border-y border-[var(--border)]" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: 'var(--fg-muted)' }}>
          Partenaires technologiques certifiés
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {PARTNERS.map(p => (
            <div
              key={p.name}
              className="font-display font-bold text-xl transition-all hover:scale-110"
              style={{ color: 'var(--fg-muted)', opacity: 0.5 }}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.08) 100%)' }} />
          <div className="relative z-10">
            <span className="badge badge-primary mb-6">Passons à l'action</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6" style={{ color: 'var(--fg)' }}>
              Prêt à transformer votre business ?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--fg-muted)' }}>
              Discutons de votre projet lors d'un appel découverte de 30 minutes — gratuit et sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary text-base px-8 py-3.5">
                Réserver un appel gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn btn-outline text-base px-8 py-3.5">
                Découvrir nos services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}
