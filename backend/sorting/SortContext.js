// strategies/SortContext.js
const DateAscStrategy = require("./DateAscStrategy");
const DateDescStrategy = require("./DateDescStrategy");
const OrderNumberAscStrategy = require("./OrderNumberAscStrategy");
const OrderNumberDescStrategy = require("./OrderNumberDescStrategy");

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
      case "order-number-desc":
        return new SortContext(new OrderNumberDescStrategy());
      case "order-number-asc":
        return new SortContext(new OrderNumberAscStrategy());
      case "desc":  // Backward compatibility
        return new SortContext(new DateDescStrategy());
      case "asc":   // Backward compatibility
      default:
        return new SortContext(new DateAscStrategy());
    }
  }
}

module.exports = SortContext;
