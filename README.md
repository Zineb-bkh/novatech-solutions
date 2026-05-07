# NovaTech — Gestion Intelligente des Candidatures (Sujet 5)

Workflow **n8n** automatisant le traitement des candidatures : scoring IA, emails personnalisés (acceptation / refus), et notification admin.

---

## Fonctionnement

1. Un webhook reçoit les données d'un candidat (score, nom, email, poste…)
2. Si le score est ≥ 70 → le candidat est mis en **shortlist**
3. Un email HTML personnalisé est envoyé au candidat (acceptation ou refus)
4. L'admin reçoit une notification pour chaque candidat shortlisté
5. Le statut est mis à jour en base de données

---

## Configuration avant import

Avant d'importer le workflow dans n8n, remplace les placeholders suivants :

| Placeholder | Où | Description |
|---|---|---|
| `YOUR_ADMIN_EMAIL` | Nœud *Email Admin — Shortlist* | Ton adresse email admin |
| `YOUR_GMAIL_CREDENTIAL_ID` | Nœuds Gmail (×3) | L'ID de ta credential Gmail dans n8n |
| `YOUR_INSTANCE_ID` | Section `meta` | L'instanceId de ton n8n |
| `YOUR_WORKFLOW_ID` | Section racine | L'ID du workflow |
| `YOUR_WEBHOOK_PATH` | Nœud Webhook | Le path de ton webhook (ex: `new-candidate`) |

---

## Import dans n8n

1. Ouvre n8n → **Workflows** → **Import from file**
2. Sélectionne `NovaTech_Sujet5_Candidatures_PUBLIC.json`
3. Connecte ta credential **Gmail OAuth2**
4. Active le workflow

---

## Structure du repo

```
novatech-candidatures/
├── README.md
├── .gitignore
└── workflow/
    └── NovaTech_Sujet5_Candidatures_PUBLIC.json
```

---

## Stack

- [n8n](https://n8n.io/) — Workflow automation
- Gmail OAuth2 — Envoi d'emails
- JavaScript (Code nodes) — Logique métier & génération HTML



# Réaliser par : Zineb Boukhou - CDL - LAAYOUNE
