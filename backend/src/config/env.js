const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "database", "classicmodels.db");

module.exports = {
  PORT,
  DB_PATH
};
