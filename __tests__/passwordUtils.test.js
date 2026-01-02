import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

describe('Password Utilities', () => {
  test('hashPassword exists and is callable', async () => {
    expect(typeof hashPassword).toBe('function');
  });

  test('comparePassword exists and is callable', async () => {
    expect(typeof comparePassword).toBe('function');
  });

  test('should hash a password successfully', async () => {
    const password = 'testPassword123!';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  test('should compare passwords correctly', async () => {
    const password = 'testPassword123!';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);
    
    expect(isValid).toBe(true);
  });

  test('should reject invalid password', async () => {
    const password = 'testPassword123!';
    const wrongPassword = 'wrongPassword456!';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(wrongPassword, hash);
    
    expect(isValid).toBe(false);
  });
});
