import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return payload', async () => {
    const payload = { sub: 'u1', email: 'test@test.com', role: 'ADMIN', companyId: 'c1' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({
      userId: 'u1',
      email: 'test@test.com',
      role: 'ADMIN',
      companyId: 'c1',
    });
  });
});
