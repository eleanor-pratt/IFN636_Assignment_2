// strategies/SortContext.js
const DateAscStrategy = require("./DateAscStrategy");
const DateDescStrategy = require("./DateDescStrategy");

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
      case "desc":
        return new SortContext(new DateDescStrategy());
      case "asc":
      default:
        return new SortContext(new DateAscStrategy());
    }
  }
}

module.exports = SortContext;
