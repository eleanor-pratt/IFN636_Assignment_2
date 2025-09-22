// strategies/OrderNumberAscStrategy.js
const SortStrategy = require("./SortStrategy");

class OrderNumberAscStrategy extends SortStrategy {
  apply(query) {
    return query.sort({ orderNumber: 1 });
  }
}

module.exports = OrderNumberAscStrategy;
