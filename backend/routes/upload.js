const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const jwt     = require('jsonwebtoken');

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

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/;
  const ext     = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format non supporté. Utilisez JPG, PNG, GIF, WEBP ou SVG.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.post('/', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });

  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({ url, filename: req.file.filename, size: req.file.size });
});

module.exports = router;