const express      = require('express');
const router       = express.Router();
const nodemailer   = require('nodemailer');
const { Subscriber } = require('../models');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis.' });

    await Subscriber.create({ email: email.toLowerCase() });

    try {
      await transporter.sendMail({
        from:    process.env.EMAIL_FROM || `NovaTech <${process.env.SMTP_USER}>`,
        to:      email,
        subject: 'Bienvenue dans la newsletter NovaTech !',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#1E3A5F;padding:24px 32px;">
              <h1 style="color:#fff;margin:0;font-size:20px;">Bienvenue chez NovaTech</h1>
            </div>
            <div style="padding:32px;background:#fff;">
              <p style="color:#111827;font-size:16px;">Bonjour,</p>
              <p style="color:#374151;">
                Merci pour votre inscription à la newsletter <strong>NovaTech Solutions</strong> !
                Vous recevrez désormais en avant-première :
              </p>
              <ul style="color:#374151;line-height:1.8;">
                <li>Nos articles tech et tutoriels</li>
                <li>Nos offres d'emploi et stages</li>
                <li>Les actualités de NovaTech</li>
              </ul>
              <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog"
                   style="background:#2563A8;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                  Découvrir nos articles
                </a>
              </div>
              <p style="color:#6b7280;font-size:13px;margin-bottom:0;">
                Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.
              </p>
            </div>
            <div style="padding:16px 32px;background:#f9fafb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                NovaTech Solutions · Technopark Casablanca
              </p>
            </div>
          </div>
        `,
      });
      console.log(`Email de bienvenue newsletter envoyé à ${email}`);
    } catch (mailErr) {
      console.error('Erreur envoi email newsletter:', mailErr.message);
    }

    res.status(201).json({ message: 'Subscribed successfully' });

  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.json({ message: 'Already subscribed' });
    }
    console.error('Erreur newsletter:', err.message);
    res.status(500).json({ error: 'Impossible de traiter votre inscription. Réessayez.' });
  }
});

module.exports = router;