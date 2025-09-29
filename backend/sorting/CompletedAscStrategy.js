const SortStrategy = require("./SortStrategy");

class CompletedAscStrategy extends SortStrategy {
  apply(query) {
    return query.sort({ completed: 1 });
  }
}

module.exports = CompletedAscStrategy;
