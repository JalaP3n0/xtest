import { createMultiTenantMiddleware } from './prisma.middleware';

describe('PrismaMultiTenantMiddleware', () => {
  it('should add companyId to findMany query', async () => {
    const middleware = createMultiTenantMiddleware('c1');
    const params = {
      model: 'Event',
      action: 'findMany',
      args: { where: { status: 'OPEN' } },
    } as any;
    const next = jest.fn().mockResolvedValue([]);

    await middleware(params, next);

    expect(params.args.where).toEqual({ status: 'OPEN', companyId: 'c1' });
    expect(next).toHaveBeenCalledWith(params);
  });

  it('should add companyId to create data', async () => {
    const middleware = createMultiTenantMiddleware('c1');
    const params = {
      model: 'User',
      action: 'create',
      args: { data: { email: 'test@test.com' } },
    } as any;
    const next = jest.fn().mockResolvedValue({});

    await middleware(params, next);

    expect(params.args.data).toEqual({ email: 'test@test.com', companyId: 'c1' });
  });

  it('should transform findUnique to findFirst and add companyId', async () => {
    const middleware = createMultiTenantMiddleware('c1');
    const params = {
      model: 'Event',
      action: 'findUnique',
      args: { where: { id: 'e1' } },
    } as any;
    const next = jest.fn().mockResolvedValue({});

    await middleware(params, next);

    expect(params.action).toBe('findFirst');
    expect(params.args.where).toEqual({ id: 'e1', companyId: 'c1' });
  });

  it('should not modify params if model is not in tenantModels', async () => {
    const middleware = createMultiTenantMiddleware('c1');
    const params = {
      model: 'Company',
      action: 'findMany',
      args: { where: {} },
    } as any;
    const next = jest.fn().mockResolvedValue([]);

    await middleware(params, next);

    expect(params.args.where).toEqual({});
  });
});
