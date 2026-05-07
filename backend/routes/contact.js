const express    = require('express');
const router     = express.Router();
const nodemailer = require('nodemailer');

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
    const { name, email, company, phone, service, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Champs obligatoires manquants (nom, email, message).' });
    }

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || `NovaTech <${process.env.SMTP_USER}>`,
      to:      process.env.SMTP_USER,          
      replyTo: email,                           
      subject: ` Nouveau contact – ${name}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#4f46e5;padding:24px 32px;">
            <h1 style="color:#fff;margin:0;font-size:20px;">Nouveau message de contact</h1>
          </div>
          <div style="padding:32px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Nom</td>      <td style="padding:8px 0;font-weight:600;color:#111827;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Email</td>     <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#4f46e5;">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#6b7280;">Entreprise</td><td style="padding:8px 0;color:#111827;">${company}</td></tr>` : ''}
              ${phone   ? `<tr><td style="padding:8px 0;color:#6b7280;">Téléphone</td><td style="padding:8px 0;color:#111827;">${phone}</td></tr>` : ''}
              ${service ? `<tr><td style="padding:8px 0;color:#6b7280;">Service</td>  <td style="padding:8px 0;color:#111827;">${service}</td></tr>` : ''}
              ${budget  ? `<tr><td style="padding:8px 0;color:#6b7280;">Budget</td>   <td style="padding:8px 0;color:#111827;">${budget}</td></tr>` : ''}
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
            <p style="color:#6b7280;margin:0 0 8px;">Message :</p>
            <p style="background:#f9fafb;border-left:4px solid #4f46e5;padding:16px;border-radius:4px;color:#111827;white-space:pre-line;margin:0;">${message}</p>
          </div>
          <div style="padding:16px 32px;background:#f9fafb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">NovaTech Solutions · ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      `,
    });

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || `NovaTech <${process.env.SMTP_USER}>`,
      to:      email,
      subject: ` Nous avons bien reçu votre message, ${name.split(' ')[0]} !`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#4f46e5;padding:24px 32px;">
            <h1 style="color:#fff;margin:0;font-size:20px;">Message reçu </h1>
          </div>
          <div style="padding:32px;background:#fff;">
            <p style="color:#111827;font-size:16px;">Bonjour <strong>${name.split(' ')[0]}</strong>,</p>
            <p style="color:#374151;">Merci de nous avoir contactés ! Nous avons bien reçu votre message et notre équipe vous répondra <strong>dans les 24 heures</strong>.</p>
            <div style="background:#f9fafb;border-left:4px solid #4f46e5;padding:16px;border-radius:4px;margin:20px 0;">
              <p style="margin:0;color:#6b7280;font-size:14px;">Votre message :</p>
              <p style="margin:8px 0 0;color:#111827;white-space:pre-line;">${message}</p>
            </div>
            <p style="color:#374151;">En attendant, n'hésitez pas à visiter notre <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/portfolio" style="color:#4f46e5;">portfolio</a> ou notre <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog" style="color:#4f46e5;">blog</a>.</p>
            <p style="color:#374151;margin-bottom:0;">À très bientôt,<br/><strong>L'équipe NovaTech</strong></p>
          </div>
          <div style="padding:16px 32px;background:#f9fafb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">NovaTech Solutions · Technopark Casablanca</p>
          </div>
        </div>
      `,
    });

    console.log(` Contact envoyé : ${name} <${email}>`);
    res.json({ message: 'Message reçu. Nous vous répondrons sous 24h.' });

  } catch (err) {
    console.error(' Erreur contact:', err.message);
    res.status(500).json({ error: 'Impossible d\'envoyer le message. Veuillez réessayer.' });
  }
});

module.exports = router;