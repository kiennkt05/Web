const analyticsRepository = require("../repositories/analyticsRepository");

function buildPivot({ row = "productLine", col = "year", value = "revenue" }) {
  const safeValue = ["revenue", "quantity", "orders"].includes(value) ? value : "revenue";
  const rows = analyticsRepository.getPivotMatrix({ row, col, value: safeValue });

  const rowKeys = [...new Set(rows.map((r) => r.rowKey))];
  const colKeys = [...new Set(rows.map((r) => r.colKey))];

  const matrix = rowKeys.map((rowKey) => {
    const item = { rowKey };
    colKeys.forEach((colKey) => {
      const found = rows.find((r) => r.rowKey === rowKey && r.colKey === colKey);
      item[colKey] = found ? Number(found.metricValue) : 0;
    });
    return item;
  });

  return {
    dimensions: { row, col, value: safeValue },
    columns: colKeys,
    matrix
  };
}

module.exports = {
  buildPivot
};
