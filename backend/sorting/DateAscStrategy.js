const SortStrategy = require("./SortStrategy");

class DateAscStrategy extends SortStrategy {
  apply(query) {
    return query.sort({ orderDate: 1 });
  }
}

module.exports = DateAscStrategy;
