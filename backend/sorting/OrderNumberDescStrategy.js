// strategies/OrderNumberDescStrategy.js
const SortStrategy = require("./SortStrategy");

class OrderNumberDescStrategy extends SortStrategy {
  apply(query) {
    return query.sort({ orderNumber: -1 });
  }
}

module.exports = OrderNumberDescStrategy;
