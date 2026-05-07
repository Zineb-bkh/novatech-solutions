import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TEAM, VALUES, COMPANY } from '@/lib/data';
import { ArrowRight, Linkedin, Twitter } from 'lucide-react';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez l\'histoire, la mission et l\'équipe derrière NovaTech Solutions.',
};

export default function AboutPage() {
  return <AboutClient />;
}
