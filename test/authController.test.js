const AuthController = require('../controllers/authController');
const User = require('../models/user');

jest.mock('../models/user');

describe('AuthController', () => {
  let req, res, controller;

  beforeEach(() => {
    controller = new AuthController();
    req = { body: { username: 'testuser', password: 'testpass' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if username or password is missing', async () => {
    req.body = {};
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Username and password required' });
  });

  it('should return 409 if user already exists', async () => {
    User.findOne.mockResolvedValue({ username: 'testuser' });
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should return 201 if user is registered', async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue();
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
  });
});
