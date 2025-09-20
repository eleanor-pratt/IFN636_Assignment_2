// strategies/DateDescStrategy.js
const SortStrategy = require("./SortStrategy");

class DateDescStrategy extends SortStrategy {
  apply(query) {
    return query.sort({ orderDate: -1 });
  }
}

module.exports = DateDescStrategy;
