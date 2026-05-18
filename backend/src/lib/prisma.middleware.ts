import { Prisma } from '@prisma/client';

export function createMultiTenantMiddleware(companyId: string): Prisma.Middleware {
  return async (params, next) => {
    // List of models that require tenant isolation
    const tenantModels = ['User', 'Event', 'StaffingAssignment', 'ChatMessage', 'MarketingCampaign'];

    if (params.model && tenantModels.includes(params.model)) {
      // Initialize args if they don't exist
      if (!params.args) {
        params.args = {};
      }

      // Cast to any to handle the complex union type of Prisma middleware arguments
      const args = params.args as any;

      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.action = 'findFirst';
        args.where = { ...args.where, companyId };
      } else if (params.action === 'findMany') {
        args.where = { ...args.where, companyId };
      } else if (params.action === 'create') {
        args.data = { ...args.data, companyId };
      } else if (params.action === 'update' || params.action === 'updateMany') {
        args.where = { ...args.where, companyId };
      } else if (params.action === 'delete' || params.action === 'deleteMany') {
        args.where = { ...args.where, companyId };
      }
    }

    return next(params);
  };
}
