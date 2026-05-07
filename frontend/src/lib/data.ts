export const COMPANY = {
  name: 'NovaTech Solutions',
  tagline: 'Transforming Digital Vision Into Reality',
  description: 'We deliver cutting-edge software solutions powered by AI, cloud computing, and innovative design.',
  email: 'contact@novatech.solutions',
  phone: '+212 522 123 456',
  address: 'Technopark Casablanca, Boulevard Ahl Loghlam, Casablanca 20100',
  founded: 2026,
  employees: '50+',
  projects: '500+',
  clients: '150+',
  social: {
    twitter: 'https://twitter.com/novatech',
    linkedin: 'https://linkedin.com/company/novatech',
    github: 'https://github.com/novatech',
    instagram: 'https://instagram.com/novatech',
  },
};

export const SERVICES = [
  {
    id: 'web',
    slug: 'web-development',
    icon: 'Globe',
    title: 'Développement Web',
    titleEn: 'Web Development',
    shortDesc: 'Applications web modernes, performantes et scalables',
    description: `Nous concevons et développons des applications web de haute performance en utilisant les technologies les plus avancées du marché. De la landing page au SaaS complexe, nous couvrons l'intégralité du cycle de développement.`,
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'GraphQL'],
    features: [
      'Applications web progressives (PWA)',
      'Architecture microservices',
      'Performance et SEO optimisés',
      'Design responsive et adaptatif',
      'Intégration APIs tierces',
      'Tests automatisés (TDD)',
    ],
    useCases: [
      { title: 'E-commerce', desc: 'Plateformes de vente en ligne haute performance avec gestion des stocks, paiements et analytics.' },
      { title: 'SaaS B2B', desc: 'Logiciels as-a-service avec authentification multi-tenant, tableaux de bord et facturation.' },
      { title: 'Portails entreprise', desc: 'Intranets et portails RH sur mesure avec workflow et gestion documentaire.' },
    ],
    color: 'from-blue-500 to-cyan-500',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    price: 'À partir de 8 000 MAD',
  },
  {
    id: 'mobile',
    slug: 'mobile-development',
    icon: 'Smartphone',
    title: 'Développement Mobile',
    titleEn: 'Mobile Development',
    shortDesc: 'Apps iOS & Android natives et cross-platform',
    description: `Nous créons des applications mobiles qui offrent une expérience utilisateur exceptionnelle sur iOS et Android. Qu'il s'agisse d'applications grand public ou d'outils professionnels, nous maîtrisons l'écosystème mobile dans son ensemble.`,
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Expo', 'MobX'],
    features: [
      'Applications natives iOS & Android',
      'Cross-platform avec React Native / Flutter',
      'Synchronisation temps réel',
      'Mode hors-ligne (offline-first)',
      'Notifications push avancées',
      'Intégration capteurs et hardware',
    ],
    useCases: [
      { title: 'Apps grand public', desc: "Applications de consommation avec onboarding soigné, animations fluides et rétention utilisateur." },
      { title: 'Apps métier', desc: 'Outils de gestion terrain pour commerciaux, techniciens ou logisticiens.' },
      { title: 'Marketplace mobile', desc: 'Plateformes de mise en relation avec géolocalisation, chat et paiements intégrés.' },
    ],
    color: 'from-purple-500 to-pink-500',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    price: 'À partir de 12 000 MAD',
  },
  {
    id: 'ai',
    slug: 'ai-data',
    icon: 'Brain',
    title: 'IA & Data',
    titleEn: 'AI & Data',
    shortDesc: 'Solutions intelligentes pour automatiser et prédire',
    description: `L'intelligence artificielle transforme les métiers. Nous développons des modèles de machine learning sur mesure, des chatbots intelligents, des pipelines de données et des systèmes de recommandation qui créent une vraie valeur ajoutée.`,
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'OpenAI API', 'Apache Spark', 'Databricks'],
    features: [
      'Machine Learning & Deep Learning',
      'NLP et grands modèles de langage (LLM)',
      'Computer Vision',
      'Analyse prédictive et forecasting',
      'Pipelines de données ETL/ELT',
      'Dashboards analytiques',
    ],
    useCases: [
      { title: 'Chatbots IA', desc: "Assistants intelligents capables de comprendre le contexte et de résoudre des demandes complexes." },
      { title: 'Prédiction des ventes', desc: 'Modèles prédictifs pour anticiper la demande et optimiser les stocks.' },
      { title: 'Détection de fraude', desc: 'Systèmes de scoring en temps réel pour prévenir la fraude financière.' },
    ],
    color: 'from-orange-500 to-red-500',
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    price: 'À partir de 15 000 MAD',
  },
  {
    id: 'cloud',
    slug: 'cloud-devops',
    icon: 'Cloud',
    title: 'Cloud & DevOps',
    titleEn: 'Cloud & DevOps',
    shortDesc: 'Infrastructure scalable et déploiements automatisés',
    description: `Nous architecturons, migrons et gérons des infrastructures cloud robustes sur AWS, Azure et GCP. Nos pratiques DevOps garantissent des déploiements rapides, sûrs et réversibles grâce à l'automatisation complète du cycle de vie applicatif.`,
    technologies: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Datadog'],
    features: [
      'Architecture cloud native',
      'Migration cloud sécurisée',
      'Infrastructure as Code (IaC)',
      'Pipelines CI/CD automatisés',
      'Monitoring et alerting 24/7',
      'Auto-scaling et haute disponibilité',
    ],
    useCases: [
      { title: 'Migration cloud', desc: "Transfert sécurisé d'applications legacy vers le cloud avec zéro downtime." },
      { title: 'Plateforme DevOps', desc: "Mise en place d'une chaîne CI/CD complète pour accélérer les livraisons." },
      { title: 'FinOps', desc: "Optimisation des coûts cloud avec rightsizing, réservations et reporting." },
    ],
    color: 'from-green-500 to-teal-500',
    gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    price: 'À partir de 5 000 MAD/mois',
  },
  {
    id: 'security',
    slug: 'cybersecurity',
    icon: 'Shield',
    title: 'Cybersécurité',
    titleEn: 'Cybersecurity',
    shortDesc: 'Protéger vos actifs numériques et données sensibles',
    description: `La cybersécurité n'est plus une option. Nous auditons, sécurisons et formons votre organisation face aux menaces actuelles : ransomware, phishing, vulnérabilités applicatives et menaces internes. Notre approche Zero Trust protège chaque couche de votre SI.`,
    technologies: ['Penetration Testing', 'SIEM/SOC', 'WAF', 'Zero Trust', 'OWASP', 'ISO 27001', 'RGPD'],
    features: [
      'Audit de sécurité & pentest',
      'Architecture Zero Trust',
      'Protection DDoS',
      'Conformité RGPD & ISO 27001',
      'Formation et sensibilisation',
      'Réponse à incident (CSIRT)',
    ],
    useCases: [
      { title: 'Audit applicatif', desc: 'Test d\'intrusion de vos applications web et mobiles pour identifier les vulnérabilités.' },
      { title: 'Conformité RGPD', desc: 'Mise en conformité complète avec accompagnement DPO et documentation.' },
      { title: 'SOC managé', desc: 'Centre opérationnel de sécurité externalisé avec supervision 24/7.' },
    ],
    color: 'from-red-500 to-rose-500',
    gradient: 'linear-gradient(135deg, #ef4444, #f43f5e)',
    price: 'À partir de 10 000 MAD',
  },
];

export const TEAM = [
  {
    id: 1,
    name: 'Youssef Benali',
    role: 'CEO & Co-Founder',
    bio: '15 ans d\'expérience dans la tech. Ancien CTO chez OCP Digital. Passionné par l\'IA et les systèmes distribués.',
    avatar: 'https://ui-avatars.com/api/?name=Youssef+Benali&background=4f46e5&color=fff&size=200',
    linkedin: '#',
    twitter: '#',
    skills: ['Strategy', 'AI', 'Leadership'],
  },
  {
    id: 2,
    name: 'Sara Idrissi',
    role: 'CTO & Co-Founder',
    bio: 'Architecte logicielle spécialisée cloud et microservices. Ex-ingénieure chez AWS Paris. Speaker à Devoxx.',
    avatar: 'https://ui-avatars.com/api/?name=Sara+Idrissi&background=7c3aed&color=fff&size=200',
    linkedin: '#',
    twitter: '#',
    skills: ['Cloud', 'Architecture', 'DevOps'],
  },
  {
    id: 3,
    name: 'Mehdi Tazi',
    role: 'Lead AI Engineer',
    bio: 'PhD en Machine Learning de l\'ENSIAS. Expert LLMs et computer vision. 50+ modèles déployés en production.',
    avatar: 'https://ui-avatars.com/api/?name=Mehdi+Tazi&background=0891b2&color=fff&size=200',
    linkedin: '#',
    twitter: '#',
    skills: ['ML', 'Python', 'LLMs'],
  },
  {
    id: 4,
    name: 'Nadia Cherkaoui',
    role: 'Head of Design',
    bio: 'Designer produit avec 10 ans d\'expérience. Ancienne chez AKQA Londres. Obsédée par l\'UX et l\'accessibilité.',
    avatar: 'https://ui-avatars.com/api/?name=Nadia+Cherkaoui&background=db2777&color=fff&size=200',
    linkedin: '#',
    twitter: '#',
    skills: ['UX', 'Figma', 'Design System'],
  },
  {
    id: 5,
    name: 'Karim Amrani',
    role: 'Lead Mobile Developer',
    bio: '8 ans de développement mobile. Créateur de 30+ apps avec plus de 2M d\'utilisateurs cumulés sur les stores.',
    avatar: 'https://ui-avatars.com/api/?name=Karim+Amrani&background=059669&color=fff&size=200',
    linkedin: '#',
    twitter: '#',
    skills: ['React Native', 'Flutter', 'iOS'],
  },
  {
    id: 6,
    name: 'Fatima Zaidane',
    role: 'Cybersecurity Lead',
    bio: 'CISSP & CEH certifiée. Spécialisée en pentest et réponse à incident. Ex-analyste SOC chez Orange Cyberdefense.',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Zaidane&background=dc2626&color=fff&size=200',
    linkedin: '#',
    twitter: '#',
    skills: ['Pentest', 'SOC', 'CISSP'],
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: 'OmniPay — Fintech Platform',
    category: 'web',
    description: 'Plateforme de paiement B2B pour PME marocaines avec tableau de bord analytique, gestion multi-devises et intégration CMI/PayPal.',
    longDesc: 'OmniPay est une solution fintech complète qui a traité plus de 500M MAD de transactions depuis son lancement. Nous avons développé l\'ensemble de la plateforme en 6 mois avec une équipe de 5 développeurs.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker'],
    results: ['500M MAD traités', '3 000 entreprises', '+40% conversions'],
    demo: 'https://omnipay.ma',
    featured: true,
  },
  {
    id: 2,
    title: 'MediConnect — Télémédecine',
    category: 'mobile',
    description: 'App de téléconsultation médicale permettant aux patients de consulter des médecins par vidéo, gérer ordonnances et dossiers médicaux.',
    longDesc: 'MediConnect a révolutionné l\'accès aux soins au Maroc avec 200 000 consultations réalisées en 18 mois.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    technologies: ['React Native', 'Firebase', 'WebRTC', 'Node.js', 'MongoDB'],
    results: ['200K consultations', '1 500 médecins', '4.8★ App Store'],
    demo: '#',
    featured: true,
  },
  {
    id: 3,
    title: 'PredictAI — Retail Analytics',
    category: 'ai',
    description: 'Moteur de prédiction des ventes et optimisation des stocks pour chaîne de distribution nationale avec 200 points de vente.',
    longDesc: 'Réduction des ruptures de stock de 67% et diminution des invendus de 43% grâce à notre modèle LSTM.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    technologies: ['Python', 'TensorFlow', 'Apache Spark', 'Airflow', 'Power BI'],
    results: ['-67% ruptures de stock', '-43% invendus', '+12M MAD économisés/an'],
    demo: '#',
    featured: false,
  },
  {
    id: 4,
    title: 'CloudMigrate — OCP Digital',
    category: 'cloud',
    description: 'Migration de 200 applications legacy vers AWS pour le groupe OCP avec zéro downtime et réduction des coûts de 35%.',
    longDesc: 'Projet de 18 mois mené en 3 phases : assessment, migration et optimisation. Architecture multi-account AWS avec Landing Zone.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    technologies: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Datadog'],
    results: ['-35% coûts infra', '200 apps migrées', '99.99% disponibilité'],
    demo: '#',
    featured: true,
  },
  {
    id: 5,
    title: 'ShopVerse — E-commerce Platform',
    category: 'web',
    description: 'Marketplace multi-vendeurs pour l\'artisanat marocain avec catalogue de 50K produits, paiement multidevises et livraison internationale.',
    longDesc: 'Plateforme e-commerce full-stack avec moteur de recherche Elasticsearch, recommandations ML et gestion logistique.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    technologies: ['Next.js', 'Elasticsearch', 'Node.js', 'Stripe', 'PostgreSQL'],
    results: ['50K produits', '1M visites/mois', '€2M GMV annuel'],
    demo: '#',
    featured: false,
  },
  {
    id: 6,
    title: 'SecureGov — Infrastructure Sécurisée',
    category: 'security',
    description: 'Audit et sécurisation de l\'infrastructure IT d\'un ministère avec mise en place d\'un SOC et conformité ISO 27001.',
    longDesc: 'Mission complète de 12 mois incluant pentest, remédiation, formation des équipes et certification ISO 27001.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    technologies: ['SIEM', 'WAF', 'Zero Trust', 'Fortinet', 'CrowdStrike'],
    results: ['ISO 27001 obtenu', '0 incident majeur', '500 agents formés'],
    demo: '#',
    featured: false,
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Hassan Alaoui',
    role: 'Directeur Digital, Groupe OCP',
    avatar: 'https://ui-avatars.com/api/?name=Hassan+Alaoui&background=1e1b4b&color=fff&size=100',
    content: 'NovaTech a transformé notre infrastructure IT en 18 mois. Leur expertise cloud et leur rigueur nous ont permis d\'économiser 35% sur notre budget infra tout en améliorant la disponibilité.',
    rating: 5,
    project: 'CloudMigrate',
  },
  {
    id: 2,
    name: 'Leila Berrada',
    role: 'CEO, MediConnect',
    avatar: 'https://ui-avatars.com/api/?name=Leila+Berrada&background=7c3aed&color=fff&size=100',
    content: 'L\'équipe NovaTech a livré notre app de télémédecine en 4 mois avec une qualité remarquable. Aujourd\'hui, 1 500 médecins utilisent la plateforme quotidiennement. Partenariat exceptionnel.',
    rating: 5,
    project: 'MediConnect',
  },
  {
    id: 3,
    name: 'Omar Bensouda',
    role: 'CTO, Label\'Vie Group',
    avatar: 'https://ui-avatars.com/api/?name=Omar+Bensouda&background=059669&color=fff&size=100',
    content: 'Le modèle IA de prédiction des stocks développé par NovaTech nous a fait économiser 12 millions de MAD la première année. ROI de 400% en 12 mois. Bluffant.',
    rating: 5,
    project: 'PredictAI',
  },
  {
    id: 4,
    name: 'Asmae Kettani',
    role: 'Directrice SI, Ministère du Commerce',
    avatar: 'https://ui-avatars.com/api/?name=Asmae+Kettani&background=dc2626&color=fff&size=100',
    content: 'Grâce à NovaTech, nous avons obtenu la certification ISO 27001 et drastiquement réduit notre surface d\'attaque. Professionnalisme et expertise de haut niveau.',
    rating: 5,
    project: 'SecureGov',
  },
];

export const PARTNERS = [
  { name: 'AWS', logo: 'AWS' },
  { name: 'Microsoft Azure', logo: 'Azure' },
  { name: 'Google Cloud', logo: 'GCP' },
  { name: 'MongoDB', logo: 'MongoDB' },
  { name: 'Vercel', logo: 'Vercel' },
  { name: 'Stripe', logo: 'Stripe' },
  { name: 'Datadog', logo: 'Datadog' },
  { name: 'GitLab', logo: 'GitLab' },
];

export const ARTICLES = [
  {
    id: '1',
    slug: 'ia-generative-revolution-entreprises',
    type: 'blog',
    category: 'technology',
    title: 'L\'IA Générative : La Révolution Silencieuse qui Transforme les Entreprises',
    excerpt: 'Comment les LLMs comme GPT-4 et Claude redéfinissent les processus métier, la productivité et l\'innovation en entreprise.',
    content: `## L'IA Générative en 2024 : État des Lieux

L'intelligence artificielle générative a franchi un cap décisif en 2024. Ce qui était perçu comme une curiosité technologique est devenu un levier de transformation indispensable pour les entreprises ambitieuses.

## Les cas d'usage qui créent de la valeur réelle

### Automatisation du service client
Les chatbots basés sur des LLMs ne se contentent plus de répondre à des FAQ. Ils comprennent le contexte, gèrent des demandes complexes et escaladent intelligemment vers un humain quand nécessaire. Résultat : -40% de coûts de support, +20% de satisfaction client.

### Génération de contenu à l'échelle
La création de fiches produits, d'articles SEO, de rapports analytiques peut être automatisée à 80%. Les équipes se concentrent sur la stratégie et la validation.

### Aide au développement logiciel
GitHub Copilot et ses concurrents améliorent la productivité des développeurs de 30 à 55% selon les études. Le code review automatisé réduit les bugs en production.

## Notre approche chez NovaTech

Nous aidons nos clients à identifier les cas d'usage à fort ROI, développer des pipelines RAG robustes et fine-tuner des modèles sur leurs données propriétaires.

> "L'IA ne remplace pas les humains. Elle amplifie les capacités des humains intelligents."

## Conclusion

Les entreprises qui intègrent l'IA générative aujourd'hui construisent un avantage compétitif durable. Celles qui attendent risquent de se retrouver distancées.`,
    author: { name: 'Mehdi Tazi', avatar: 'https://ui-avatars.com/api/?name=Mehdi+Tazi&background=4f46e5&color=fff&size=60', role: 'Lead AI Engineer' },
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
    tags: ['IA', 'LLM', 'Transformation digitale', 'GPT'],
    readTime: 8,
    views: 4521,
    likes: 234,
    publishedAt: '2024-01-20',
  },
  {
    id: '2',
    slug: 'novatech-ouvre-bureau-dubai',
    type: 'news',
    category: 'company',
    title: 'NovaTech Solutions Ouvre son Premier Bureau International à Dubaï',
    excerpt: 'En réponse à une forte demande du marché MENA, NovaTech étend sa présence avec un bureau à Dubaï Technology Park.',
    content: `## Une expansion stratégique dans le Golfe

NovaTech Solutions franchit une nouvelle étape majeure dans son développement avec l'ouverture d'un bureau à Dubaï Technology Park, le 1er février 2024.

## Pourquoi Dubaï ?

Le marché des EAU investit massivement dans la transformation digitale. Dubai's D33 Agenda vise à positionner la ville parmi les 4 économies numériques mondiales d'ici 2033. Cela représente une opportunité considérable pour nos services.

## Ce que cela signifie pour nos clients

Nos clients marocains et africains bénéficieront d'une meilleure couverture régionale. Nos nouveaux clients du Golfe auront accès à nos équipes en présentiel.

L'équipe initiale comprend 8 collaborateurs : consultants, développeurs et un directeur commercial dédié à la région Golfe.

## Nos ambitions pour 2024

- Signer 20 nouveaux contrats dans la région GCC
- Recruter 15 talents locaux d'ici décembre
- Atteindre 15% du CA depuis le marché Golfe`,
    author: { name: 'Youssef Benali', avatar: 'https://ui-avatars.com/api/?name=Youssef+Benali&background=4f46e5&color=fff&size=60', role: 'CEO' },
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    tags: ['Expansion', 'Dubaï', 'Internationalisation'],
    readTime: 4,
    views: 2890,
    likes: 156,
    publishedAt: '2024-01-25',
  },
  {
    id: '3',
    slug: 'senior-fullstack-developer',
    type: 'job',
    category: 'career',
    title: 'Senior Fullstack Developer — React / Node.js',
    excerpt: 'Rejoignez notre équipe tech pour travailler sur des projets à fort impact pour des clients grands comptes.',
    content: `## À propos du poste

Nous cherchons un(e) développeur(se) Fullstack senior pour renforcer notre équipe technique et travailler sur des projets innovants pour nos clients.

## Vos responsabilités

- Concevoir et développer des fonctionnalités frontend (React/Next.js) et backend (Node.js)
- Participer aux revues de code et améliorer la qualité du codebase
- Collaborer avec les designers et les chefs de projet
- Mentorer les développeurs juniors
- Contribuer aux choix d'architecture technique

## Profil recherché

- 5+ ans d'expérience en développement web
- Maîtrise de React, Next.js, TypeScript
- Solide expérience Node.js / Express ou NestJS
- Bases de données SQL et NoSQL
- Connaissance des pratiques CI/CD
- Sens du détail et souci de la qualité

## Ce que nous offrons

- Salaire compétitif : 18 000 - 25 000 MAD/mois
- Télétravail hybride (3j/2j)
- Budget formation annuel de 5 000 MAD
- Mutuelle santé premium
- Équipement dernière génération (MacBook Pro)
- Team building trimestriel`,
    author: { name: 'Sara Idrissi', avatar: 'https://ui-avatars.com/api/?name=Sara+Idrissi&background=7c3aed&color=fff&size=60', role: 'CTO' },
    image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=1200&q=80',
    tags: ['Emploi', 'React', 'Node.js', 'Fullstack'],
    readTime: 5,
    views: 3200,
    likes: 89,
    publishedAt: '2024-01-28',
    jobDetails: {
      position: 'Senior Fullstack Developer',
      department: 'Engineering',
      location: 'Casablanca (Hybride)',
      type: 'full-time',
      salary: { min: 18000, max: 25000, currency: 'MAD' },
    },
  },
  {
    id: '4',
    slug: 'kubernetes-best-practices-2024',
    type: 'blog',
    category: 'technology',
    title: '10 Best Practices Kubernetes en Production que Personne ne Vous Dit',
    excerpt: 'Après avoir géré des clusters K8s pour 50+ clients, voici les leçons apprises à la dure sur la résilience et l\'observabilité.',
    content: `## Pourquoi Kubernetes est à la fois génial et piégeux

Kubernetes est devenu le standard de facto pour l'orchestration de conteneurs. Mais le chemin vers un cluster production-ready est semé d'embûches.

## 1. Les Limits et Requests sont obligatoires

Sans resource limits, un pod peut consommer toute la RAM du node et provoquer des OOMKill en cascade. Définissez TOUJOURS requests et limits.

## 2. Liveness vs Readiness Probes : ne pas confondre

La readiness probe détermine si le pod peut recevoir du trafic. La liveness probe détermine si le pod doit être redémarré. Mal configurées, elles causent des boucles de redémarrage catastrophiques.

## 3. Pod Disruption Budgets pour la haute disponibilité

Sans PDB, un drain de node peut tuer tous vos pods simultanément. Protégez vos workloads critiques.

## 4. Horizontal Pod Autoscaler bien calibré

Le HPA basé sur la CPU seule est souvent insuffisant. Combinez avec des métriques custom (RPS, latence queue) via KEDA.

## 5. Network Policies pour la microsegmentation

Par défaut, tous les pods peuvent communiquer. Implémentez des Network Policies pour isoler les namespaces et réduire la surface d'attaque.

## Conclusion

Kubernetes maîtrisé est un outil extraordinaire. Kubernetes mal configuré est une source infinie de réveils nocturnes.`,
    author: { name: 'Sara Idrissi', avatar: 'https://ui-avatars.com/api/?name=Sara+Idrissi&background=7c3aed&color=fff&size=60', role: 'CTO' },
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80',
    tags: ['Kubernetes', 'DevOps', 'Cloud', 'Production'],
    readTime: 12,
    views: 6780,
    likes: 412,
    publishedAt: '2024-02-05',
  },
  {
    id: '5',
    slug: 'lead-data-scientist',
    type: 'job',
    category: 'career',
    title: 'Lead Data Scientist — Machine Learning & LLMs',
    excerpt: 'Pilotez notre practice Data Science et travaillez sur des problèmes complexes avec des données réelles à fort impact.',
    content: `## Le poste

En tant que Lead Data Scientist, vous piloterez la practice Data Science de NovaTech et travaillerez sur des projets ML/IA à fort impact pour nos clients dans la finance, la santé et la distribution.

## Missions

- Définir la roadmap technique de la practice Data Science
- Développer des modèles ML en production (classification, régression, NLP, vision)
- Implémenter des pipelines RAG avec des LLMs
- Encadrer une équipe de 3 data scientists
- Participer aux avant-ventes et à la rédaction de propositions

## Compétences requises

- Master/PhD en Data Science, statistiques ou domaine connexe
- 6+ ans d'expérience en machine learning
- Python expert (scikit-learn, TensorFlow, PyTorch)
- Expérience avec les LLMs (fine-tuning, RAG, prompt engineering)
- MLOps : MLflow, DVC, Weights & Biases
- Capacité à vulgariser pour des non-techniciens

## Package

- Salaire : 22 000 - 30 000 MAD/mois
- Stock options sur le plan de participation
- Budget conf internationales (NeurIPS, ICML)
- Flexibilité totale sur les horaires
- Accès GPU cloud pour vos expérimentations`,
    author: { name: 'Mehdi Tazi', avatar: 'https://ui-avatars.com/api/?name=Mehdi+Tazi&background=0891b2&color=fff&size=60', role: 'Lead AI Engineer' },
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80',
    tags: ['Emploi', 'Data Science', 'ML', 'LLM'],
    readTime: 6,
    views: 2100,
    likes: 67,
    publishedAt: '2024-02-10',
    jobDetails: {
      position: 'Lead Data Scientist',
      department: 'Data & AI',
      location: 'Casablanca / Remote',
      type: 'full-time',
      salary: { min: 22000, max: 30000, currency: 'MAD' },
    },
  },
  {
    id: '6',
    slug: 'novatech-certifiee-aws-advanced',
    type: 'news',
    category: 'company',
    title: 'NovaTech Obtient la Certification AWS Advanced Consulting Partner',
    excerpt: 'Une reconnaissance de notre expertise cloud qui nous permet d\'accéder aux programmes partenaires AWS les plus exclusifs.',
    content: `## AWS Advanced Consulting Partner : Qu'est-ce que ça signifie ?

La certification Advanced Consulting Partner AWS est accordée aux partenaires qui ont démontré une expertise technique de haut niveau et une capacité à livrer des projets cloud complexes avec succès.

## Le chemin pour y arriver

Obtenir cette certification a nécessité 18 mois de travail : certifications individuelles de 12 ingénieurs, 5 projets référence documentés et validation par les équipes AWS.

## Ce que cela change pour nos clients

Nos clients bénéficient maintenant de tarifs partenaires AWS, d'un accès prioritaire au support technique AWS et d'une visibilité renforcée sur l'AWS Marketplace.

## La prochaine étape : AWS Premier Partner

Nous visons la certification Premier Partner d'ici 2025, le niveau le plus élevé du programme partenaire AWS.`,
    author: { name: 'Sara Idrissi', avatar: 'https://ui-avatars.com/api/?name=Sara+Idrissi&background=7c3aed&color=fff&size=60', role: 'CTO' },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    tags: ['AWS', 'Certification', 'Cloud', 'Partenariat'],
    readTime: 3,
    views: 1890,
    likes: 98,
    publishedAt: '2024-02-15',
  },
];

export const VALUES = [
  {
    icon: 'Zap',
    title: 'Excellence technique',
    desc: 'Nous ne faisons pas de compromis sur la qualité du code, des architectures et des livrables.',
  },
  {
    icon: 'Heart',
    title: 'Client au centre',
    desc: 'Le succès de nos clients est notre succès. Nous mesurons notre performance à leur réussite.',
  },
  {
    icon: 'Lightbulb',
    title: 'Innovation continue',
    desc: 'Nous investissons 20% de notre temps en R&D pour rester à la pointe des technologies.',
  },
  {
    icon: 'Users',
    title: 'Collaboration radicale',
    desc: 'Pas de silos, pas d\'ego. La meilleure idée gagne, quelle que soit sa source.',
  },
  {
    icon: 'Shield',
    title: 'Éthique et transparence',
    desc: 'Nous disons ce que nous faisons et faisons ce que nous disons. Toujours.',
  },
  {
    icon: 'Globe',
    title: 'Impact positif',
    desc: 'Nous choisissons nos projets pour leur impact positif sur la société et l\'environnement.',
  },
];

export const FAQ_CHATBOT: Record<string, { keywords: string[]; answer: string }> = {
  services: {
    keywords: ['service', 'offer', 'faire', 'développ', 'propos'],
    answer: ' Nous offrons 5 services : **Développement Web & Mobile**, **IA & Data Science**, **Cloud & DevOps**, et **Cybersécurité**. Lequel vous intéresse ?',
  },
  pricing: {
    keywords: ['prix', 'tarif', 'coût', 'budget', 'combien', 'price', 'cost'],
    answer: ' Nos tarifs débutent à **8 000 MAD** pour un projet web. Nous proposons des devis sur mesure selon votre besoin. Souhaitez-vous un devis gratuit ?',
  },
  contact: {
    keywords: ['contact', 'email', 'appel', 'phone', 'joindre', 'reach'],
    answer: ' Contactez-nous par email à **contact@novatech.solutions** ou par téléphone au **+212 522 123 456**. Nous répondons sous 24h.',
  },
  jobs: {
    keywords: ['emploi', 'job', 'carrière', 'recrut', 'postuler', 'work', 'career'],
    answer: ' Nous avons des postes ouverts ! Visitez notre section **Blog > Offres d\'emploi** pour voir les opportunités actuelles et postuler.',
  },
  team: {
    keywords: ['équipe', 'team', 'qui', 'fondateur', 'who', 'founder'],
    answer: '👥 NovaTech est fondée par **Youssef Benali** (CEO) et **Sara Idrissi** (CTO). Notre équipe de 50+ experts est basée à Casablanca et Dubaï.',
  },
  location: {
    keywords: ['où', 'adresse', 'localisation', 'where', 'location', 'casablanca', 'maroc'],
    answer: ' Notre siège est au **Technopark Casablanca**. Nous avons aussi un bureau à **Dubaï Technology Park** et travaillons avec des clients dans toute l\'Afrique et le Golfe.',
  },
  delay: {
    keywords: ['délai', 'durée', 'temps', 'combien de temps', 'timeline', 'deadline'],
    answer: ' Les délais varient selon le projet : **4-8 semaines** pour un site vitrine, **3-6 mois** pour une application complexe. Nous définissons des sprints clairs avec des livrables intermédiaires.',
  },
};
