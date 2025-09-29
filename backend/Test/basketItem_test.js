
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const BasketItem = require('../models/Basket');
const { getBasketItems, createBasketItem, updateBasketItem, deleteBasketItem } = require('../controllers/basketController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('Create Basket Item Function Test', () => {
  it('should create a new item in the basket successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { quantity: 1, plant: new mongoose.Types.ObjectId()}
    };

    // Mock item that would be created
    const createdBasketItem = { _id: new mongoose.Types.ObjectId(), ...req.plant };

    // Stub Basket.create to return the createdBasket
    const createStub = sinon.stub(BasketItem, 'create').resolves(createdBasketItem);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createBasketItem(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body  })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdBasketItem)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Basket.create to throw an error
    const createStub = sinon.stub(BasketItem, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { quantity: 1, plant: new mongoose.Types.ObjectId()}
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createBasketItem(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Basket Item Function Test', () => {

  it('should update basket item successfully', async () => {
    // Mock plant data
    const plantId = new mongoose.Types.ObjectId();
    const plant = {
      _id: plantId,
      botanicalName: "Plant Botanical",
      commonName: "Plant Common",
      stockCount: 1,
      seasonality: "Spring",
      description: "Old Description",
    };

    // Mock basket data
    const userId = new mongoose.Types.ObjectId();
    const existingBasketItem = {
      _id: userId,
      plant: plant,
      quantity: 2,
      save: sinon.stub().resolvesThis(), // Mock save method
      populate: sinon.stub().resolvesThis()
    };

    const findByIdQueryStub = {
      populate: sinon.stub().resolves(existingBasketItem)
    };
    // Stub Item.findById to return mock item
    const findByIdStub = sinon.stub(BasketItem, 'findById').returns(findByIdQueryStub);

    // Mock request & response
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      params: {id: existingBasketItem.id},
      body: { quantity: 2}
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateBasketItem(req, res);

    // Assertions
    expect(existingBasketItem.quantity).to.equal(2);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if item is not found', async () => {
    const findByIdQueryStub = {
      populate: sinon.stub().resolves(null)
    };
    // Stub Item.findById to return mock item
    const findByIdStub = sinon.stub(BasketItem, 'findById').returns(findByIdQueryStub);
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateBasketItem(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Basket item not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(BasketItem, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateBasketItem(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });
});

describe('GetBasketItems Function Test', () => {
  it('should return items', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    const items = [
      { 
        _id: userId,
        plant: {
          _id: new mongoose.Types.ObjectId(),
          botanicalName: "Plant Botanical",
          commonName: "Plant Common",
          stockCount: 1,
          seasonality: "Spring",
          description: "Old Description",
        },
        quantity: 2,
      },
      {
        _id: userId,
        plant: {
          _id: new mongoose.Types.ObjectId(),
          botanicalName: "Plant Botanical 2",
          commonName: "Plant Common 2",
          stockCount: 1,
          seasonality: "Spring 2",
          description: "Old Description 2",
        },
        quantity: 1,
      },
    ];

    const findQueryStub = {
      populate: sinon.stub().resolves(items)
    };

    const findStub = sinon.stub(BasketItem, 'find').returns(findQueryStub);

    // Mock request & response
    const req = {
      user: {id: userId}
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getBasketItems(req, res);

    // Assertions
    expect(findStub.calledOnceWith({userId: userId})).be.true;
    expect(res.json.calledWith(items)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const findStub = sinon.stub(BasketItem, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getBasketItems(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });
});

describe('DeleteBasketItem Function Test', () => {

  it('should delete an item successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock item found in the database
    const item = { remove: sinon.stub().resolves() };

    // Stub BasketItem.findById to return the mock item
    const findByIdStub = sinon.stub(BasketItem, 'findById').resolves(item);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBasketItem(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(item.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Basket item deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if item is not found', async () => {
    // Stub BasketItem.findById to return null
    const findByIdStub = sinon.stub(BasketItem, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBasketItem(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Basket item not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub BasketItem.findById to throw an error
    const findByIdStub = sinon.stub(BasketItem, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBasketItem(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});