const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:     { type: DataTypes.STRING(100), allowNull: false },
  email:    { type: DataTypes.STRING(191), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role:     { type: DataTypes.ENUM('admin', 'editor'), defaultValue: 'editor' },
  avatar:   { type: DataTypes.STRING(255) },
  active:   { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'users', timestamps: true });

const Article = sequelize.define('Article', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:       { type: DataTypes.STRING(255), allowNull: false },
  slug:        { type: DataTypes.STRING(255), allowNull: false, unique: true },
  content:     { type: DataTypes.TEXT('long'), allowNull: false },
  excerpt:     { type: DataTypes.STRING(400) },
  type:        { type: DataTypes.ENUM('news', 'job', 'blog'), defaultValue: 'blog' },
  category:    { type: DataTypes.ENUM('technology', 'company', 'industry', 'career') },
  authorId:    { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  imageUrl:    { type: DataTypes.STRING(500) },
  imageAlt:    { type: DataTypes.STRING(255) },
  jobPosition:      { type: DataTypes.STRING(100) },
  jobDepartment:    { type: DataTypes.STRING(100) },
  jobLocation:      { type: DataTypes.STRING(100) },
  jobType:          { type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'remote', 'stage') },
  jobSalaryMin:     { type: DataTypes.INTEGER },
  jobSalaryMax:     { type: DataTypes.INTEGER },
  jobSalaryCurrency:{ type: DataTypes.STRING(10), defaultValue: 'MAD' },
  stageDuration:    { type: DataTypes.STRING(50) },
  tags: {
    type: DataTypes.TEXT,
    get() { const v = this.getDataValue('tags'); return v ? JSON.parse(v) : []; },
    set(v) { this.setDataValue('tags', JSON.stringify(v)); },
  },
  published:   { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATE },
  views:       { type: DataTypes.INTEGER, defaultValue: 0 },
  likes:       { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'articles', timestamps: true });

const Application = sequelize.define('Application', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jobId:       { type: DataTypes.INTEGER, allowNull: false, references: { model: 'articles', key: 'id' } },

  jobType:     { type: DataTypes.ENUM('emploi', 'stage'), defaultValue: 'emploi' },
  jobPosition: { type: DataTypes.STRING(200) },

  firstName:   { type: DataTypes.STRING(100), allowNull: false },
  lastName:    { type: DataTypes.STRING(100), allowNull: false },
  email:       { type: DataTypes.STRING(191), allowNull: false },
  phone:       { type: DataTypes.STRING(30) },

  cvFilename:  { type: DataTypes.STRING(255) },
  cvPath:      { type: DataTypes.STRING(500) },
  cvMimetype:  { type: DataTypes.STRING(100) },
  cvSize:      { type: DataTypes.INTEGER },

  coverLetter: { type: DataTypes.TEXT },
  portfolio:   { type: DataTypes.STRING(500) },
  linkedin:    { type: DataTypes.STRING(500) },
  skills:      { type: DataTypes.TEXT },
  education:   { type: DataTypes.STRING(100) },

  school:      { type: DataTypes.STRING(200) },
  filiere:     { type: DataTypes.STRING(200) },
  duration:    { type: DataTypes.STRING(50) },
  startDate:   { type: DataTypes.DATEONLY },

  aiScore:          { type: DataTypes.INTEGER },
  aiCategory:       { type: DataTypes.ENUM('Excellent', 'Bon', 'Moyen', 'Insuffisant') },
  aiRecommendation: { type: DataTypes.STRING(100) },
  aiFeedback:       { type: DataTypes.TEXT },
  aiNotes:          { type: DataTypes.TEXT },
  aiAnalyzedAt:     { type: DataTypes.DATE },

  status: {
    type:         DataTypes.ENUM('pending', 'reviewed', 'interviewed', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  notes: { type: DataTypes.TEXT },

}, { tableName: 'applications', timestamps: true });


const Project = sequelize.define('Project', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:        { type: DataTypes.STRING(255), allowNull: false },
  category:     { type: DataTypes.ENUM('web', 'mobile', 'ai', 'cloud', 'security') },
  description:  { type: DataTypes.TEXT },
  longDesc:     { type: DataTypes.TEXT('long') },
  image:        { type: DataTypes.STRING(500) },
  technologies: {
    type: DataTypes.TEXT,
    get() { const v = this.getDataValue('technologies'); return v ? JSON.parse(v) : []; },
    set(v) { this.setDataValue('technologies', JSON.stringify(v)); },
  },
  results: {
    type: DataTypes.TEXT,
    get() { const v = this.getDataValue('results'); return v ? JSON.parse(v) : []; },
    set(v) { this.setDataValue('results', JSON.stringify(v)); },
  },
  demo:      { type: DataTypes.STRING(500) },
  featured:  { type: DataTypes.BOOLEAN, defaultValue: false },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'projects', timestamps: true });


const Subscriber = sequelize.define('Subscriber', {
  id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email:  { type: DataTypes.STRING(191), allowNull: false, unique: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'subscribers', timestamps: true });


Article.belongsTo(User,        { as: 'author',       foreignKey: 'authorId' });
User.hasMany(Article,          { as: 'articles',     foreignKey: 'authorId' });
Application.belongsTo(Article, { as: 'job',          foreignKey: 'jobId' });
Article.hasMany(Application,   { as: 'applications', foreignKey: 'jobId' });

module.exports = { sequelize, User, Article, Application, Project, Subscriber };