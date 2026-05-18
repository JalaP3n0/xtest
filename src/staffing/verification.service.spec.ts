import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { PrismaService } from '../lib/prisma.service';
import { StorageService } from '../lib/storage.service';
import { BadRequestException } from '@nestjs/common';

describe('VerificationService', () => {
  let service: VerificationService;
  let prisma: PrismaService;
  let storage: StorageService;

  const mockPrisma = {
    staffingAssignment: {
      update: jest.fn(),
    },
    checkin: {
      create: jest.fn(),
    },
  };

  const mockStorage = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: StorageService, useValue: mockStorage },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    prisma = module.get<PrismaService>(PrismaService);
    storage = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException for invalid QR code', async () => {
    await expect(service.verifyCheckIn('e1', 'u1', 'INVALID', {})).rejects.toThrow(BadRequestException);
  });

  it('should verify check-in and update records', async () => {
    mockStorage.uploadFile.mockResolvedValue('http://s3/photo.jpg');
    mockPrisma.staffingAssignment.update.mockResolvedValue({});
    mockPrisma.checkin.create.mockResolvedValue({ id: 'c1' });

    const result = await service.verifyCheckIn('e1', 'u1', 'EVENT-e1', {});

    expect(result).toEqual({ id: 'c1' });
    expect(mockStorage.uploadFile).toHaveBeenCalledWith({}, 'events/e1/checkins');
    expect(mockPrisma.staffingAssignment.update).toHaveBeenCalledWith({
      where: {
        eventId_usherId: { eventId: 'e1', usherId: 'u1' },
      },
      data: expect.objectContaining({
        status: 'CHECKED_IN',
        checkInPhoto: 'http://s3/photo.jpg',
      }),
    });
  });
});
