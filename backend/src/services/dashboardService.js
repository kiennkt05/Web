const analyticsRepository = require("../repositories/analyticsRepository");

function getDashboard(year) {
  const { kpi, monthlyRows, productLineRows } = analyticsRepository.getDashboardSummary(year);

  return {
    kpi: {
      totalRevenue: Number(kpi.totalRevenue || 0),
      totalOrders: Number(kpi.totalOrders || 0),
      totalCustomers: Number(kpi.totalCustomers || 0),
      totalProducts: Number(kpi.totalProducts || 0)
    },
    charts: {
      monthlyRevenue: monthlyRows,
      revenueByProductLine: productLineRows
    }
  };
}

module.exports = {
  getDashboard
};
