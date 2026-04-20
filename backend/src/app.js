const express = require("express");
const cors = require("cors");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", analyticsRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({
    message: "Internal server error",
    detail: err.message
  });
});

module.exports = app;
