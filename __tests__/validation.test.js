import {
  validateMember,
  validateTrainer,
  validateEquipment
} from '../middleware/validation.js';

describe('Input Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('validateMember is a function', () => {
    expect(typeof validateMember).toBe('function');
  });

  test('validateTrainer is a function', () => {
    expect(typeof validateTrainer).toBe('function');
  });

  test('validateEquipment is a function', () => {
    expect(typeof validateEquipment).toBe('function');
  });

  test('validateMember passes with valid data', () => {
    req.body = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      membershipType: 'Gold'
    };

    validateMember(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateMember fails without name', () => {
    req.body = {
      email: 'john@example.com',
      membershipType: 'Gold'
    };

    validateMember(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('validateTrainer passes with valid data', () => {
    req.body = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567890',
      specialization: 'CrossFit'
    };

    validateTrainer(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateEquipment passes with valid data', () => {
    req.body = {
      name: 'Treadmill',
      category: 'Cardio',
      quantity: 5
    };

    validateEquipment(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateEquipment fails with invalid quantity', () => {
    req.body = {
      name: 'Treadmill',
      category: 'Cardio',
      quantity: -5
    };

    validateEquipment(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
