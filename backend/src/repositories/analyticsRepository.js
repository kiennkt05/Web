const db = require("../config/db");

function getDashboardSummary(year) {
  const params = year ? [year] : [];
  const where = year ? "WHERE strftime('%Y', o.order_date) = ?" : "";

  const kpi = db
    .prepare(
      `
      SELECT
        COALESCE(SUM(od.quantity * od.price_each), 0) AS totalRevenue,
        COUNT(DISTINCT o.id) AS totalOrders,
        COUNT(DISTINCT o.customer_id) AS totalCustomers,
        COUNT(DISTINCT od.product_id) AS totalProducts
      FROM orders o
      LEFT JOIN order_details od ON od.order_id = o.id
      ${where}
      `
    )
    .get(...params);

  const monthlyRows = db
    .prepare(
      `
      SELECT
        strftime('%m', o.order_date) AS month,
        ROUND(SUM(od.quantity * od.price_each), 2) AS revenue
      FROM orders o
      JOIN order_details od ON od.order_id = o.id
      ${where}
      GROUP BY month
      ORDER BY month
      `
    )
    .all(...params);

  const productLineRows = db
    .prepare(
      `
      SELECT
        p.product_line AS productLine,
        ROUND(SUM(od.quantity * od.price_each), 2) AS revenue
      FROM orders o
      JOIN order_details od ON od.order_id = o.id
      JOIN products p ON p.id = od.product_id
      ${where}
      GROUP BY p.product_line
      ORDER BY revenue DESC
      `
    )
    .all(...params);

  return { kpi, monthlyRows, productLineRows };
}

function searchData({ query, type, country, limit, offset }) {
  const q = `%${query || ""}%`;
  const whereCountry = country ? " AND c.country = @country " : "";
  const sqlByType = {
    customers: `
      SELECT
        'customer' AS recordType,
        c.id,
        c.name,
        c.country,
        c.city,
        c.sales_rep AS subtitle
      FROM customers c
      WHERE (LOWER(c.name) LIKE LOWER(@q) OR LOWER(c.city) LIKE LOWER(@q) OR LOWER(c.sales_rep) LIKE LOWER(@q))
      ${whereCountry}
      ORDER BY c.name
      LIMIT @limit OFFSET @offset
    `,
    orders: `
      SELECT
        'order' AS recordType,
        o.id,
        c.name,
        c.country,
        o.status AS city,
        o.order_date AS subtitle
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE (CAST(o.id AS TEXT) LIKE @q OR LOWER(c.name) LIKE LOWER(@q))
      ${whereCountry}
      ORDER BY o.order_date DESC
      LIMIT @limit OFFSET @offset
    `,
    products: `
      SELECT
        'product' AS recordType,
        p.id,
        p.name,
        '-' AS country,
        p.product_line AS city,
        printf('Stock: %d', p.quantity_in_stock) AS subtitle
      FROM products p
      WHERE (LOWER(p.name) LIKE LOWER(@q) OR LOWER(p.product_line) LIKE LOWER(@q))
      ORDER BY p.name
      LIMIT @limit OFFSET @offset
    `
  };

  const baseParams = { q, country, limit, offset };

  if (type !== "all") {
    return db.prepare(sqlByType[type]).all(baseParams);
  }

  const merged = ["customers", "orders", "products"].flatMap((key) =>
    db.prepare(sqlByType[key]).all(baseParams)
  );
  return merged.slice(0, limit);
}

function getStatsByTab({ tab, year, metric }) {
  const params = year && year !== "all" ? [year] : [];
  const where = year && year !== "all" ? "WHERE strftime('%Y', o.order_date) = ?" : "";
  const metricExpr =
    metric === "quantity"
      ? "SUM(od.quantity)"
      : metric === "orders"
        ? "COUNT(DISTINCT o.id)"
        : "SUM(od.quantity * od.price_each)";

  const map = {
    time: `
      SELECT strftime('%m', o.order_date) AS label, ROUND(${metricExpr}, 2) AS value
      FROM orders o JOIN order_details od ON od.order_id = o.id
      ${where}
      GROUP BY label
      ORDER BY label
    `,
    customer: `
      SELECT c.name AS label, ROUND(${metricExpr}, 2) AS value
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN order_details od ON od.order_id = o.id
      ${where}
      GROUP BY c.id
      ORDER BY value DESC
      LIMIT 10
    `,
    product: `
      SELECT p.name AS label, ROUND(${metricExpr}, 2) AS value
      FROM orders o
      JOIN order_details od ON od.order_id = o.id
      JOIN products p ON p.id = od.product_id
      ${where}
      GROUP BY p.id
      ORDER BY value DESC
      LIMIT 10
    `,
    country: `
      SELECT c.country AS label, ROUND(${metricExpr}, 2) AS value
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN order_details od ON od.order_id = o.id
      ${where}
      GROUP BY c.country
      ORDER BY value DESC
    `
  };

  return db.prepare(map[tab]).all(...params);
}

function getPivotMatrix({ row, col, value }) {
  const valueExpr =
    value === "quantity"
      ? "od.quantity"
      : value === "orders"
        ? "1"
        : "(od.quantity * od.price_each)";

  const dimMap = {
    year: "strftime('%Y', o.order_date)",
    country: "c.country",
    status: "o.status",
    productLine: "p.product_line"
  };

  const rowExpr = dimMap[row];
  const colExpr = dimMap[col];
  if (!rowExpr || !colExpr || row === col) {
    throw new Error("Invalid pivot dimensions");
  }

  return db
    .prepare(
      `
      SELECT
        ${rowExpr} AS rowKey,
        ${colExpr} AS colKey,
        ROUND(SUM(${valueExpr}), 2) AS metricValue
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN order_details od ON od.order_id = o.id
      JOIN products p ON p.id = od.product_id
      GROUP BY rowKey, colKey
      ORDER BY rowKey, colKey
      `
    )
    .all();
}

function getGeneralInsights() {
  const revenue = db
    .prepare("SELECT ROUND(COALESCE(SUM(quantity * price_each), 0), 2) AS totalRevenue FROM order_details")
    .get();
  const topCustomer = db
    .prepare(
      `
      SELECT c.name, ROUND(SUM(od.quantity * od.price_each), 2) AS revenue
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN order_details od ON od.order_id = o.id
      GROUP BY c.id
      ORDER BY revenue DESC
      LIMIT 1
      `
    )
    .get();
  const topProduct = db
    .prepare(
      `
      SELECT p.name, SUM(od.quantity) AS qty
      FROM order_details od
      JOIN products p ON p.id = od.product_id
      GROUP BY p.id
      ORDER BY qty DESC
      LIMIT 1
      `
    )
    .get();
  return { revenue, topCustomer, topProduct };
}

module.exports = {
  getDashboardSummary,
  searchData,
  getStatsByTab,
  getPivotMatrix,
  getGeneralInsights
};
