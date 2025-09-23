/**
 * Essential Test Suite for Sorting Feature
 * 
 * This simplified test file covers the core functionality of the Strategy Pattern
 * implementation used for sorting orders with minimal but comprehensive coverage.
 */

const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const SortContext = require('../sorting/SortContext');
const SortStrategy = require('../sorting/SortStrategy');
const DateAscStrategy = require('../sorting/DateAscStrategy');
const DateDescStrategy = require('../sorting/DateDescStrategy');
const CompletedAscStrategy = require('../sorting/CompletedAscStrategy');
const CompletedDescStrategy = require('../sorting/CompletedDescStrategy');
const { getAllOrders, getOrderForUser } = require('../controllers/orderController');
const Order = require('../models/Order');
const { expect } = chai;

// Global cleanup to ensure no stubs persist between test suites
afterEach(() => {
  sinon.restore();
});


describe('Sorting Feature Tests', () => {

  describe('SortStrategy Base Class Tests', () => {
    
    it('should throw error when apply method is not implemented', () => {
      const strategy = new SortStrategy();
      expect(() => strategy.apply({})).to.throw('Sort method not implemented');
    });

  });

  describe('Individual Strategy Tests', () => {
    
    it('should apply date ascending sort correctly', () => {
      const strategy = new DateAscStrategy();
      const mockQuery = { sort: sinon.stub().returnsThis() };

      strategy.apply(mockQuery);

      expect(mockQuery.sort.calledOnceWith({ orderDate: 1 })).to.be.true;
    });

    it('should apply date descending sort correctly', () => {
      const strategy = new DateDescStrategy();
      const mockQuery = { sort: sinon.stub().returnsThis() };

      strategy.apply(mockQuery);

      expect(mockQuery.sort.calledOnceWith({ orderDate: -1 })).to.be.true;
    });

    it('should apply order filled to not filled sort correctly', () => {
      const strategy = new CompletedAscStrategy();
      const mockQuery = { sort: sinon.stub().returnsThis() };

      strategy.apply(mockQuery);

      expect(mockQuery.sort.calledOnceWith({ completed: 1 })).to.be.true;
    });

    it('should apply order not filled to filled sort correctly', () => {
      const strategy = new CompletedDescStrategy();
      const mockQuery = { sort: sinon.stub().returnsThis() };

      strategy.apply(mockQuery);

      expect(mockQuery.sort.calledOnceWith({ completed: -1 })).to.be.true;
    });

  });

  describe('SortContext Factory Method Tests', () => {
    
    it('should create correct strategies for all sort parameters', () => {
      expect(SortContext.createFromRequest('date-desc').strategy).to.be.instanceOf(DateDescStrategy);
      expect(SortContext.createFromRequest('date-asc').strategy).to.be.instanceOf(DateAscStrategy);
      expect(SortContext.createFromRequest('completed-desc').strategy).to.be.instanceOf(CompletedDescStrategy);
      expect(SortContext.createFromRequest('completed-asc').strategy).to.be.instanceOf(CompletedAscStrategy);
      expect(SortContext.createFromRequest('unknown').strategy).to.be.instanceOf(DateAscStrategy); // default
    });

  });

  describe('Controller Integration Tests', () => {
    
    it('should apply sorting when sort parameter is provided', async () => {
      const sortStub = sinon.stub().returnsThis();
      const findStub = sinon.stub(Order, 'find').returns({ sort: sortStub });

      const req = {
        query: { sort: 'date-desc' },
        user: { id: new mongoose.Types.ObjectId() }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getAllOrders(req, res);

      expect(findStub.calledOnceWith({})).to.be.true;
      expect(sortStub.calledOnceWith({ orderDate: -1 })).to.be.true;
    });

    it('should not apply sorting when no sort parameter is provided', async () => {
      const sortStub = sinon.stub().returnsThis();
      const findStub = sinon.stub(Order, 'find').returns({ sort: sortStub });

      const req = {
        query: {},
        user: { id: new mongoose.Types.ObjectId() }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getAllOrders(req, res);

      expect(findStub.calledOnceWith({ })).to.be.true;
      expect(sortStub.called).to.be.false;
    });

  });

  describe('Error Handling Tests', () => {
    
    it('should handle database errors gracefully', async () => {
      const findStub = sinon.stub(Order, 'find').throws(new Error('Database error'));
      
      const req = {
        query: { sort: 'date-desc' },
        user: { id: new mongoose.Types.ObjectId() }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getAllOrders(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Database error' })).to.be.true;
    });

  });

});
