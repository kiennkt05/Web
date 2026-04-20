const analyticsRepository = require("../repositories/analyticsRepository");

function getStatistics({ tab = "time", year = "all", metric = "revenue" }) {
  const safeTab = ["time", "customer", "product", "country"].includes(tab) ? tab : "time";
  const safeMetric = ["revenue", "quantity", "orders"].includes(metric) ? metric : "revenue";
  const rows = analyticsRepository.getStatsByTab({ tab: safeTab, year, metric: safeMetric });

  return {
    tab: safeTab,
    metric: safeMetric,
    year,
    rows
  };
}

module.exports = {
  getStatistics
};
