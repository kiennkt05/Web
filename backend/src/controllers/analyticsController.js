const dashboardService = require("../services/dashboardService");
const searchService = require("../services/searchService");
const statisticsService = require("../services/statisticsService");
const pivotService = require("../services/pivotService");
const chatbotService = require("../services/chatbotService");

function getDashboard(req, res, next) {
  try {
    const data = dashboardService.getDashboard(req.query.year);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function search(req, res, next) {
  try {
    const data = searchService.search(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function getStatistics(req, res, next) {
  try {
    const data = statisticsService.getStatistics(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function getPivot(req, res, next) {
  try {
    const data = pivotService.buildPivot(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function askChatbot(req, res, next) {
  try {
    const answer = chatbotService.answerQuestion(req.body?.message);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  search,
  getStatistics,
  getPivot,
  askChatbot
};
