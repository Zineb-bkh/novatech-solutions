const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'novatech',
  process.env.MYSQL_USER     || 'root',
  process.env.MYSQL_PASSWORD || 'root123',
  {
    host:    process.env.MYSQL_HOST || 'localhost',
    port:    process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

module.exports = sequelize;
