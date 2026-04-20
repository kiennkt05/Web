const express = require("express");
const controller = require("../controllers/analyticsController");

const router = express.Router();

router.get("/dashboard", controller.getDashboard);
router.get("/search", controller.search);
router.get("/statistics", controller.getStatistics);
router.get("/pivot", controller.getPivot);
router.post("/chatbot/ask", controller.askChatbot);

module.exports = router;
