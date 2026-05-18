import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockCompanyService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a company', async () => {
    mockCompanyService.create.mockResolvedValue({ id: 'c1', name: 'Company 1' });
    const result = await controller.create('Company 1');
    expect(result).toEqual({ id: 'c1', name: 'Company 1' });
    expect(service.create).toHaveBeenCalledWith('Company 1');
  });

  it('should find all companies', async () => {
    mockCompanyService.findAll.mockResolvedValue([{ id: 'c1', name: 'Company 1' }]);
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 'c1', name: 'Company 1' }]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
