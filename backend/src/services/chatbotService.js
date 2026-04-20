const analyticsRepository = require("../repositories/analyticsRepository");

function answerQuestion(message) {
  const text = String(message || "").toLowerCase();
  const insights = analyticsRepository.getGeneralInsights();

  if (!text.trim()) {
    return "Ban hay nhap cau hoi ve doanh thu, khach hang hoac san pham.";
  }

  if (text.includes("doanh thu")) {
    return `Tong doanh thu hien tai la $${Number(insights.revenue.totalRevenue).toLocaleString()}.`;
  }

  if (text.includes("khach hang") || text.includes("top khach")) {
    if (!insights.topCustomer) return "Chua co du lieu khach hang de phan tich.";
    return `Khach hang dan dau la ${insights.topCustomer.name} voi doanh thu $${Number(insights.topCustomer.revenue).toLocaleString()}.`;
  }

  if (text.includes("san pham") || text.includes("ban chay")) {
    if (!insights.topProduct) return "Chua co du lieu san pham de phan tich.";
    return `San pham ban chay nhat la ${insights.topProduct.name} voi ${Number(insights.topProduct.qty).toLocaleString()} don vi.`;
  }

  return "Toi co the tra loi ve doanh thu, top khach hang, top san pham, pivot va thong ke. Hay thu hoi cu the hon.";
}

module.exports = {
  answerQuestion
};
