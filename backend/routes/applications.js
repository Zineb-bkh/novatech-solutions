const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const jwt      = require('jsonwebtoken');
const axios    = require('axios');
const { Application, Article } = require('../models');

const uploadDir = path.join(__dirname, '../uploads/cvs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `cv-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

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

function normalizeJobType(jobType) {
  if (!jobType) return 'emploi';
  const val = jobType.toLowerCase().trim();
  if (['stage', 'internship', 'intern', 'alternance'].includes(val)) return 'stage';
  return 'emploi';
}

function readPdfAsBase64(filePath) {
  try {
    if (!filePath || !fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath).toString('base64');
  } catch (err) {
    console.error('Erreur lecture PDF:', err.message);
    return null;
  }
}

function buildPrompt(data) {
  const isStage   = data.jobType === 'stage';
  const typeLabel = isStage ? 'STAGE' : 'EMPLOI';
  const stageInfo = isStage
    ? `\n- École: ${data.school || 'N/A'}\n- Filière: ${data.filiere || 'N/A'}\n- Durée souhaitée: ${data.duration || 'N/A'}\n- Date de début: ${data.startDate || 'N/A'}`
    : '';

  return `Tu es un expert RH chez NovaTech Solutions, entreprise spécialisée en développement web, IA et cloud au Maroc.

Analyse cette candidature de type [${typeLabel}] et fournis une évaluation structurée.

== DONNÉES CANDIDAT ==
- Nom: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Poste visé: ${data.jobPosition || 'N/A'}
- Formation: ${data.education || 'Non précisé'}${stageInfo}
- Compétences déclarées: ${data.skills || 'Non précisées'}

== LETTRE DE MOTIVATION ==
${data.coverLetter || 'Non fournie'}

== INSTRUCTIONS ==
Réponds UNIQUEMENT en JSON valide (sans markdown, sans backticks, sans texte avant ou après), avec ce format exact:
{
  "score": <nombre entier entre 0 et 100>,
  "category": <"Excellent" | "Bon" | "Moyen" | "Insuffisant">,
  "strengths": [<liste de 2-4 points forts courts>],
  "weaknesses": [<liste de 1-3 axes d'amélioration courts>],
  "recommendation": <"Inviter à un entretien" | "Mettre en liste d'attente" | "Refuser poliment">,
  "feedback_candidat": <message personnalisé de 2-3 phrases pour le candidat en français>,
  "notes_recruteur": <note interne pour le recruteur, 1-2 phrases>
}`;
}

async function analyzeWithOllama(data) {
  const ollamaUrl   = process.env.OLLAMA_URL   || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';

  const prompt = buildPrompt(data);

  try {
    console.log(` Ollama → analyse de ${data.firstName} ${data.lastName} avec ${ollamaModel}...`);
    const res = await axios.post(
      `${ollamaUrl}/api/generate`,
      {
        model:  ollamaModel,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.3 },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000, 
      }
    );

    const raw     = res.data.response;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Aucun JSON trouvé dans la réponse Ollama');

    const result = JSON.parse(jsonMatch[0]);

    if (typeof result.score !== 'number') throw new Error('Champ score manquant ou invalide');

    console.log(` Ollama ✓ : ${data.firstName} ${data.lastName} → score ${result.score}/100 (${result.category})`);
    return result;

  } catch (err) {
    console.error('Erreur analyse Ollama:', err.response?.data || err.message);
    return null;
  }
}

async function analyzeWithGemini(data, pdfBase64 = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY non définie — fallback Gemini ignoré');
    return null;
  }

  const prompt = buildPrompt(data);
  const parts  = [{ text: prompt }];

  try {
    console.log(` Gemini (fallback) → analyse de ${data.firstName} ${data.lastName}...`);
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      },
      {
        headers: { 'content-type': 'application/json' },
        timeout: 30000,
      }
    );

    const raw        = res.data.candidates[0].content.parts[0].text;
    const jsonMatch  = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Aucun JSON trouvé dans la réponse Gemini');

    const result = JSON.parse(jsonMatch[0]);
    console.log(` Gemini ✓ : ${data.firstName} ${data.lastName} → score ${result.score}/100 (${result.category})`);
    return result;

  } catch (err) {
    console.error('Erreur analyse Gemini:', err.response?.data || err.message);
    return null;
  }
}

async function analyzeCandidate(data, pdfBase64 = null) {
  const ollamaResult = await analyzeWithOllama(data);
  if (ollamaResult) return ollamaResult;

  console.warn(' Ollama indisponible — tentative fallback Gemini...');
  const geminiResult = await analyzeWithGemini(data, pdfBase64);
  if (geminiResult) return geminiResult;

  console.error(' Aucun provider IA disponible (Ollama + Gemini ont échoué)');
  return null;
}

async function triggerN8nWebhook(payload) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL non définie — webhook ignoré');
    return;
  }
  try {
    await axios.post(webhookUrl, payload, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(' Webhook n8n déclenché pour:', payload.name);
  } catch (err) {
    console.error('Erreur webhook n8n:', err.message);
  }
}

router.post('/', upload.single('cv'), async (req, res) => {
  try {
    const {
      jobId, jobPosition, jobType,
      firstName, lastName, email, phone,
      coverLetter, portfolio, linkedin,
      skills, education,
      school, filiere, duration, startDate,
    } = req.body;

    if (!jobId || !firstName || !lastName || !email)
      return res.status(400).json({ error: 'Missing required fields' });

    const normalizedJobType = normalizeJobType(jobType);

    const application = await Application.create({
      jobId,
      jobPosition,
      jobType:     normalizedJobType,
      firstName,
      lastName,
      email:       email.toLowerCase(),
      phone,
      coverLetter,
      portfolio,
      linkedin,
      skills,
      education,
      school,
      filiere,
      duration,
      startDate:   startDate || null,
      cvFilename:  req.file?.filename,
      cvPath:      req.file?.path,
      cvMimetype:  req.file?.mimetype,
      cvSize:      req.file?.size,
      status:      'pending',
    });

    res.status(201).json({ message: 'Application submitted', id: application.id });

    const pdfBase64 = readPdfAsBase64(req.file?.path);

    const aiData = {
      jobPosition, firstName, lastName, email,
      jobType: normalizedJobType,
      education, skills, coverLetter, school, filiere, duration, startDate,
    };
    const aiResult = await analyzeCandidate(aiData, pdfBase64);

    if (aiResult) {
      const r0 = (aiResult.recommendation || '').toLowerCase();
      let initialStatus = 'pending';
      if (r0.includes('entretien') || r0.includes('inviter'))            initialStatus = 'interviewed';
      else if (r0.includes("liste d'attente") || r0.includes('attente')) initialStatus = 'reviewed';
      else if (r0.includes('refuser') || r0.includes('refus'))           initialStatus = 'rejected';
      else if (aiResult.score >= 80) initialStatus = 'interviewed';
      else if (aiResult.score >= 60) initialStatus = 'reviewed';
      else                           initialStatus = 'rejected';

      await application.update({
        aiScore:          aiResult.score,
        aiCategory:       aiResult.category,
        aiRecommendation: aiResult.recommendation,
        aiFeedback:       aiResult.feedback_candidat,
        aiNotes:          aiResult.notes_recruteur,
        aiAnalyzedAt:     new Date(),
        status:           initialStatus,
      });
    }

    await triggerN8nWebhook({
      applicationId:  application.id,
      name:           `${firstName} ${lastName}`,
      firstName, lastName, email, phone,
      jobPosition,
      jobType:        normalizedJobType,
      skills, education, school, filiere, duration, coverLetter,
      cvFileName:     req.file?.filename || '',
      score:          aiResult?.score          ?? null,
      category:       aiResult?.category       ?? null,
      recommendation: aiResult?.recommendation ?? null,
      feedback:       aiResult?.feedback_candidat ?? null,
      submittedAt:    new Date().toISOString(),
    });

  } catch (err) {
    console.error('POST /api/applications:', err);
    if (!res.headersSent) res.status(400).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, jobId, jobType } = req.query;
    const where = {};
    if (status)  where.status  = status;
    if (jobId)   where.jobId   = jobId;
    if (jobType) where.jobType = jobType;

    const { count, rows: applications } = await Application.findAndCountAll({
      where,
      include: [{ model: Article, as: 'job', attributes: ['id', 'title', 'jobPosition'] }],
      order:   [['createdAt', 'DESC']],
      limit:   parseInt(limit),
      offset:  (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ applications, total: count, totalPages: Math.ceil(count / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/shortlist', auth, async (req, res) => {
  try {
    const { jobType } = req.query;
    const { Op } = require('sequelize');
    const where = { aiScore: { [Op.gte]: 70 } };
    if (jobType) where.jobType = jobType;

    const apps = await Application.findAll({
      where,
      include: [{ model: Article, as: 'job', attributes: ['id', 'title', 'jobPosition'] }],
      order:   [['aiScore', 'DESC']],
    });

    res.json({ shortlist: apps, total: apps.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/cv', auth, async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id);
    if (!app?.cvPath) return res.status(404).json({ error: 'CV not found' });
    res.download(app.cvPath, app.cvFilename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id, {
      include: [{ model: Article, as: 'job', attributes: ['id', 'title', 'jobPosition'] }],
    });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id, {
      include: [{ model: Article, as: 'job', attributes: ['jobPosition', 'jobType'] }],
    });

    if (!app) return res.status(404).json({ error: 'Candidature introuvable' });

    const pdfBase64 = readPdfAsBase64(app.cvPath);

    const aiData = {
      firstName:   app.firstName,
      lastName:    app.lastName,
      email:       app.email,
      jobPosition: app.jobPosition || app.job?.jobPosition || 'N/A',
      jobType:     app.jobType,
      education:   app.education,
      skills:      app.skills,
      coverLetter: app.coverLetter,
      school:      app.school,
      filiere:     app.filiere,
      duration:    app.duration,
      startDate:   app.startDate,
    };

    const aiResult = await analyzeCandidate(aiData, pdfBase64);

    if (!aiResult) {
      return res.status(503).json({
        error: 'Analyse IA indisponible — vérifiez que Ollama est démarré (ollama serve) ou que GEMINI_API_KEY est valide dans .env',
      });
    }

    function recommendationToStatus(recommendation, score) {
      const r = (recommendation || '').toLowerCase();
      if (r.includes('entretien') || r.includes('inviter'))  return 'interviewed';
      if (r.includes('liste d\'attente') || r.includes('attente')) return 'reviewed';
      if (r.includes('refuser') || r.includes('refus'))      return 'rejected';
      if (score >= 80) return 'interviewed';
      if (score >= 60) return 'reviewed';
      return 'rejected';
    }

    const newStatus = recommendationToStatus(aiResult.recommendation, aiResult.score);

    await app.update({
      aiScore:          aiResult.score,
      aiCategory:       aiResult.category,
      aiRecommendation: aiResult.recommendation,
      aiFeedback:       aiResult.feedback_candidat,
      aiNotes:          aiResult.notes_recruteur,
      aiAnalyzedAt:     new Date(),
      status:           newStatus,
    });

    console.log(` Re-analyse: ${app.firstName} ${app.lastName} → ${aiResult.score}/100`);

    res.json({
      id:               app.id,
      aiScore:          aiResult.score,
      aiCategory:       aiResult.category,
      aiRecommendation: aiResult.recommendation,
      aiFeedback:       aiResult.feedback_candidat,
      aiNotes:          aiResult.notes_recruteur,
      aiAnalyzedAt:     new Date(),
      status:           newStatus,
    });

  } catch (err) {
    console.error('POST /api/applications/:id/analyze:', err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const app = await Application.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });
    await app.update({ status, notes });
    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;