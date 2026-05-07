const express      = require('express');
const router       = express.Router();
const jwt          = require('jsonwebtoken');
const slugify      = require('slugify');
const nodemailer   = require('nodemailer');
const { Op }       = require('sequelize');
const { Article, User, Subscriber } = require('../models');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function notifySubscribers(article) {
  try {
    const subscribers = await Subscriber.findAll({ where: { active: true } });
    if (!subscribers.length) return;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const articleUrl  = `${frontendUrl}/blog/${article.slug}`;

    const typeLabel = article.type === 'job'  ? "Nouvelle offre d'emploi"
                    : article.type === 'news' ? 'Actualité NovaTech'
                    :                           'Nouvel article';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#1E3A5F;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:18px;">${typeLabel}</h1>
        </div>
        <div style="padding:32px;background:#fff;">
          ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.imageAlt || ''}" style="width:100%;border-radius:8px;margin-bottom:20px;object-fit:cover;max-height:220px;" />` : ''}
          <h2 style="color:#1E3A5F;margin:0 0 12px;font-size:22px;">${article.title}</h2>
          ${article.excerpt ? `<p style="color:#374151;line-height:1.7;margin:0 0 24px;">${article.excerpt}</p>` : ''}
          <div style="text-align:center;margin:28px 0;">
            <a href="${articleUrl}" style="background:#2563A8;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
              Lire l'article →
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
        subject: `${typeLabel} — ${article.title}`,
        html,
      }).catch(err => console.error(`Email non envoyé à ${sub.email}:`, err.message))
    );

    await Promise.all(sends);
    console.log(`Newsletter envoyée à ${subscribers.length} abonné(s) — "${article.title}"`);
  } catch (err) {
    console.error('Erreur notification abonnés:', err.message);
  }
}

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'novatech-secret-2024');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, type, category, search, sort = 'publishedAt', order = 'DESC' } = req.query;
    const where = { published: true };
    if (type)              where.type     = type;
    if (category)          where.category = category;
    if (req.query.jobType) where.jobType  = req.query.jobType;
    if (search)            where.title    = { [Op.like]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id','name','avatar'] }],
      order:   [[sort, order.toUpperCase()]],
      limit:   parseInt(limit),
      offset,
    });

    res.json({ articles, total: count, totalPages: Math.ceil(count / parseInt(limit)), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      where:   { slug: req.params.slug, published: true },
      include: [{ model: User, as: 'author', attributes: ['id','name','avatar'] }],
    });
    if (!article) return res.status(404).json({ error: 'Not found' });
    await article.increment('views');
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, type, category, imageUrl, imageAlt,
            jobPosition, jobDepartment, jobLocation, jobType, jobSalaryMin,
            jobSalaryMax, jobSalaryCurrency, stageDuration, tags, published } = req.body;

    const slug    = slugify(title, { lower: true, strict: true });
    const article = await Article.create({
      title, slug, content, excerpt, type, category, imageUrl, imageAlt,
      jobPosition, jobDepartment, jobLocation, jobType, jobSalaryMin,
      jobSalaryMax, jobSalaryCurrency, stageDuration,
      tags: tags || [], published: published || false,
      publishedAt: published ? new Date() : null,
      authorId: req.userId,
    });

    if (published) notifySubscribers(article);

    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });

    const wasPublished = article.published;
    const update = { ...req.body };
    if (update.title)                              update.slug        = slugify(update.title, { lower: true, strict: true });
    if (update.published && !article.publishedAt)  update.publishedAt = new Date();

    await article.update(update);

    if (!wasPublished && article.published) notifySubscribers(article);

    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Article.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });
    await article.increment('likes');
    res.json({ likes: article.likes + 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;