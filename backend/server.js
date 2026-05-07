require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const path    = require('path');

const { sequelize } = require('./models');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/articles',     require('./routes/articles'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/newsletter',   require('./routes/newsletter'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/upload',       require('./routes/upload'));   

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0', db: 'mysql' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log(' MySQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log(' Tables synchronisées');
    app.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error(' MySQL connection error:', err.message);
    process.exit(1);
  });

module.exports = app;