const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//Connect to data base
const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB,
  /* para dejar de ver tantos logs en la consola */
  logging: false,
});

module.exports = { db, DataTypes };
