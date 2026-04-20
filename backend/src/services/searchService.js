const analyticsRepository = require("../repositories/analyticsRepository");

function search({ query = "", type = "all", country = "", page = 1, pageSize = 12 }) {
  const safeType = ["all", "customers", "orders", "products"].includes(type) ? type : "all";
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 12));
  const offset = (safePage - 1) * safePageSize;

  const records = analyticsRepository.searchData({
    query,
    type: safeType,
    country,
    limit: safePageSize,
    offset
  });

  return {
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      count: records.length
    },
    records
  };
}

module.exports = {
  search
};
