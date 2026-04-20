const fs = require("fs");
const path = require("path");
const db = require("../config/db");

function executeSqlFile(relativePath) {
  const fullPath = path.join(__dirname, "..", relativePath);
  const sql = fs.readFileSync(fullPath, "utf8");
  db.exec(sql);
}

executeSqlFile("db/schema.sql");
executeSqlFile("db/seed.sql");

console.log("Database initialized successfully.");
