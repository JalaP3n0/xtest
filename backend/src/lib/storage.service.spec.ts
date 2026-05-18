import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file and return url', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await service.uploadFile({}, 'test');
    expect(result).toContain('https://s3.amazonaws.com');
    expect(consoleSpy).toHaveBeenCalledWith('Uploading file to S3 folder: test');
    consoleSpy.mockRestore();
  });
});
