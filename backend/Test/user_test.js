const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
afterEach(() => sinon.restore());

const { expect } = chai;
chai.use(chaiHttp);

// SUTs
const User = require('../models/User');
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

/* --------------------------------- Add User -------------------------------- */

describe('AddUser Function Test', () => {
  it('should create a new user successfully and not return password', async () => {
    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'secret', role: 1 },
    };

    // what controller will call after create -> toObject() then remove password
    const createdUserDoc = {
      toObject: () => ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: 'hashed', // should be removed by controller
      }),
    };

    const createStub = sinon.stub(User, 'create').resolves(createdUserDoc);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await addUser(req, res);

    expect(createStub.calledOnceWith({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    })).to.be.true;

    expect(res.status.calledWith(201)).to.be.true;

    const returned = res.json.firstCall.args[0];
    expect(returned).to.have.property('name', 'Alice');
    expect(returned).to.have.property('email', 'alice@example.com');
    expect(returned).to.have.property('role', 1);
    expect(returned).to.not.have.property('password');

    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const createStub = sinon.stub(User, 'create').throws(new Error('DB Error'));

    const req = { body: { name: 'Bob', email: 'bob@example.com', password: 'x' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await addUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    createStub.restore();
  });
});

/* -------------------------------- Get Users -------------------------------- */

describe('GetUsers Function Test', () => {
  it('should return users without passwords', async () => {
    const users = [
      { _id: new mongoose.Types.ObjectId(), name: 'A', email: 'a@x.com', role: 0 },
      { _id: new mongoose.Types.ObjectId(), name: 'B', email: 'b@x.com', role: 1 },
    ];

    // Stub the chained call: User.find({}).select('-password')
    const selectStub = sinon.stub().resolves(users);
    const findStub = sinon.stub(User, 'find').returns({ select: selectStub });

    const req = {};
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getUsers(req, res);

    expect(findStub.calledOnceWith({})).to.be.true;
    expect(selectStub.calledOnceWith('-password')).to.be.true;
    expect(res.json.calledWith(users)).to.be.true;
    expect(res.status.called).to.be.false;

    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const findStub = sinon.stub(User, 'find').throws(new Error('DB Error'));
    const req = {};
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getUsers(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findStub.restore();
  });
});

/* ------------------------------- Update User ------------------------------- */

describe('UpdateUser Function Test', () => {
  it('should update user successfully (no password change)', async () => {
    const userId = new mongoose.Types.ObjectId();

    // existing doc that controller mutates then calls save()
    const existingUserDoc = {
      _id: userId,
      name: 'Old',
      email: 'old@example.com',
      role: 0,
      save: sinon.stub().resolves({
        toObject: () => ({
          _id: userId,
          name: 'New Name',
          email: 'new@example.com',
          role: 1,
        }),
      }),
    };

    const findByIdStub = sinon.stub(User, 'findById').resolves(existingUserDoc);

    const req = {
      params: { id: userId },
      body: { name: 'New Name', email: 'new@example.com', role: 1 }, // no password
    };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await updateUser(req, res);

    expect(existingUserDoc.name).to.equal('New Name');
    expect(existingUserDoc.email).to.equal('new@example.com');
    expect(existingUserDoc.role).to.equal(1);
    expect(existingUserDoc.save.calledOnce).to.be.true;

    const returned = res.json.firstCall.args[0];
    expect(returned).to.not.have.property('password');

    expect(res.status.called).to.be.false;

    findByIdStub.restore();
  });

  it('should update user password when provided', async () => {
    const userId = new mongoose.Types.ObjectId();

    const existingUserDoc = {
      _id: userId,
      name: 'Old',
      email: 'old@example.com',
      role: 0,
      password: 'oldhash',
      save: sinon.stub().resolves({
        toObject: () => ({
          _id: userId,
          name: 'Old',
          email: 'old@example.com',
          role: 0,
          // password not returned after sanitize
        }),
      }),
    };

    const findByIdStub = sinon.stub(User, 'findById').resolves(existingUserDoc);

    const req = {
      params: { id: userId },
      body: { password: 'newpass' },
    };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await updateUser(req, res);

    expect(existingUserDoc.password).to.equal('newpass'); // pre('save') would hash in real run
    expect(existingUserDoc.save.calledOnce).to.be.true;
    const returned = res.json.firstCall.args[0];
    expect(returned).to.not.have.property('password');

    findByIdStub.restore();
  });

  it('should return 404 if user is not found', async () => {
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateUser(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });
});

/* ------------------------------- Delete User ------------------------------- */

describe('DeleteUser Function Test', () => {
  it('should delete a user successfully', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    const userDoc = { remove: sinon.stub().resolves() };
    const findByIdStub = sinon.stub(User, 'findById').resolves(userDoc);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteUser(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(userDoc.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'User deleted' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if user is not found', async () => {
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteUser(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });
});
