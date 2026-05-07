const express      = require('express');
const router       = express.Router();
const jwt          = require('jsonwebtoken');
const nodemailer   = require('nodemailer');
const { Project, Subscriber } = require('../models');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error();
    jwt.verify(token, process.env.JWT_SECRET || 'novatech-secret-2024');
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function notifySubscribers(project) {
  try {
    const subscribers = await Subscriber.findAll({ where: { active: true } });
    if (!subscribers.length) return;

    const frontendUrl  = process.env.FRONTEND_URL || 'http://localhost:3000';
    const projectUrl   = `${frontendUrl}/portfolio`;

    const categoryLabels = {
      web: ' Projet Web', mobile: ' Projet Mobile',
      ai: ' Projet IA', cloud: ' Projet Cloud', security: ' Projet Sécurité',
    };
    const typeLabel = categoryLabels[project.category] || ' Nouveau Projet';

    const techList = Array.isArray(project.technologies) && project.technologies.length
      ? `<p style="margin:0 0 20px;"><strong style="color:#1E3A5F;">Technologies :</strong> ${project.technologies.join(' · ')}</p>`
      : '';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#1E3A5F;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:18px;">${typeLabel}</h1>
        </div>
        <div style="padding:32px;background:#fff;">
          ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width:100%;border-radius:8px;margin-bottom:20px;object-fit:cover;max-height:220px;" />` : ''}
          <h2 style="color:#1E3A5F;margin:0 0 12px;font-size:22px;">${project.title}</h2>
          ${project.description ? `<p style="color:#374151;line-height:1.7;margin:0 0 16px;">${project.description}</p>` : ''}
          ${techList}
          <div style="text-align:center;margin:28px 0;">
            <a href="${projectUrl}" style="background:#2563A8;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
              Voir le projet →
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;margin-bottom:0;">
            Vous recevez cet email car vous êtes abonné(e) à la newsletter NovaTech Solutions.
          </p>
        </div>
        <div style="padding:16px 32px;background:#f9fafb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">NovaTech Solutions · Technopark Casablanca</p>
        </div>
      </div>
    `;

    const sends = subscribers.map(sub =>
      transporter.sendMail({
        from:    process.env.EMAIL_FROM || `NovaTech <${process.env.SMTP_USER}>`,
        to:      sub.email,
        subject: `${typeLabel} — ${project.title}`,
        html,
      }).catch(err => console.error(`  Email non envoyé à ${sub.email}:`, err.message))
    );

    await Promise.all(sends);
    console.log(` Notification projet envoyée à ${subscribers.length} abonné(s) — "${project.title}"`);
  } catch (err) {
    console.error(' Erreur notification projet:', err.message);
  }
}

router.get('/', async (req, res) => {
  try {
    const where = { published: true };
    if (req.query.category) where.category = req.query.category;
    const projects = await Project.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create(req.body);

    if (project.published) notifySubscribers(project);

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });

    const wasPublished = project.published;
    await project.update(req.body);

    if (!wasPublished && project.published) notifySubscribers(project);

    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Project.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;