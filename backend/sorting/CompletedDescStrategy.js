const SortStrategy = require("./SortStrategy");

class CompletedDescStrategy extends SortStrategy {
  apply(query) {
    return query.sort({ completed: -1 });
  }
}

module.exports = CompletedDescStrategy;
