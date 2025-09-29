const DateAscStrategy = require("./DateAscStrategy");
const DateDescStrategy = require("./DateDescStrategy");
const CompletedDescStrategy = require("./CompletedDescStrategy");
const CompletedAscStrategy = require("./CompletedAscStrategy");

class SortContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  applyStrategy(query) {
    if (!this.strategy) {
      throw new Error("No strategy set");
    }
    return this.strategy.apply(query);
  }

  static createFromRequest(sortParam) {
    switch (sortParam) {
      case "date-desc":
        return new SortContext(new DateDescStrategy());
      case "date-asc":
        return new SortContext(new DateAscStrategy());
      case "completed-desc":
        return new SortContext(new CompletedDescStrategy());
      case "completed-asc":
        return new SortContext(new CompletedAscStrategy());
      case "desc":  // Backward compatibility
        return new SortContext(new DateDescStrategy());
      case "asc":   // Backward compatibility
      default:
        return new SortContext(new DateAscStrategy());
    }
  }
}

module.exports = SortContext;
