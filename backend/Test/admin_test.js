const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
afterEach(() => sinon.restore());

const { expect } = chai;
chai.use(chaiHttp);

// SUTs
const { adminOnly } = require('../middleware/authMiddleware');

/* ----------------------------- Admin Middleware ---------------------------- */

describe('adminOnly Middleware', () => {
  it('should allow access for admin role (role === 1)', async () => {
    const req = { user: { _id: new mongoose.Types.ObjectId(), role: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    adminOnly(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
  });

  it('should block access for non-admin role', async () => {
    const req = { user: { _id: new mongoose.Types.ObjectId(), role: 0 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    adminOnly(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Admins only' })).to.be.true;
  });

  it('should block access when req.user is missing', async () => {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    adminOnly(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Admins only' })).to.be.true;
  });
});