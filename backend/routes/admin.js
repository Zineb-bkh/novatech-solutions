const express   = require('express');
const router    = express.Router();
const jwt       = require('jsonwebtoken');
const { Op, fn, col } = require('sequelize');
const { Article, Application, Project, Subscriber, User } = require('../models');


const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'novatech-secret-2024');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};


router.get('/stats', auth, async (req, res) => {
  try {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth(); 

    
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));

    
    const startOfMonth = new Date(year, month, 1);

    const [
      totalApplications,
      publishedArticles,
      publishedProjects,
      activeSubscribers,
      newAppsThisWeek,
      newAppsThisMonth,
    ] = await Promise.all([
      Application.count(),
      Article.count({ where: { published: true } }),
      Project.count({ where: { published: true } }),
      Subscriber.count({ where: { active: true } }),
      Application.count({ where: { createdAt: { [Op.gte]: startOfWeek } } }),
      Application.count({ where: { createdAt: { [Op.gte]: startOfMonth } } }),
    ]);

    const statusRows = await Application.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    });
    const byStatus = { pending: 0, reviewed: 0, interviewed: 0, accepted: 0, rejected: 0 };
    for (const row of statusRows) {
      if (Object.prototype.hasOwnProperty.call(byStatus, row.status)) {
        byStatus[row.status] = parseInt(row.count);
      }
    }

    
    const monthlyApplications = [];
    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
      const d     = new Date(year, month - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = await Application.count({
        where: { createdAt: { [Op.gte]: start, [Op.lt]: end } },
      });
      monthlyApplications.push(count);
      monthLabels.push(start.toLocaleString('fr-FR', { month: 'short' }));
    }

    const activeJobs = await Article.count({
      where: { published: true, type: 'job' },
    });

    res.json({
      totalApplications,
      publishedArticles,
      publishedProjects,
      activeSubscribers,
      activeJobs,
      newAppsThisWeek,
      newAppsThisMonth,
      byStatus,
      monthlyApplications,
      monthLabels,
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/articles', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, type, search } = req.query;
    const where = {};
    if (type)              where.type    = type;
    if (req.query.jobType) where.jobType = req.query.jobType;
    if (search)            where.title   = { [Op.like]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'avatar'] }],
      order:   [['createdAt', 'DESC']],
      limit:   parseInt(limit),
      offset,
    });

    res.json({ articles, total: count, totalPages: Math.ceil(count / parseInt(limit)), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/applications', auth, async (req, res) => {
  try {
    const { limit = 50, status } = req.query;
    const where = {};
    if (status) where.status = status;
    const applications = await Application.findAll({
      where,
      order:   [['createdAt', 'DESC']],
      limit:   parseInt(limit),
      include: [{ model: Article, as: 'job', attributes: ['id', 'title'] }],
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;