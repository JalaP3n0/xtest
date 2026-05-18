import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { StorageService } from '../lib/storage.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async verifyCheckIn(
    eventId: string,
    usherId: string,
    qrCode: string,
    photoFile: any,
  ) {
    // 1. Simple QR verification (In a real app, this would be more complex)
    const expectedQR = `EVENT-${eventId}`;
    if (qrCode !== expectedQR) {
      throw new BadRequestException('Invalid QR Code');
    }

    // 2. Upload photo to S3
    const photoUrl = await this.storage.uploadFile(photoFile, `events/${eventId}/checkins`);

    // 3. Update StaffingAssignment
    await this.prisma.staffingAssignment.update({
      where: {
        eventId_usherId: { eventId, usherId },
      },
      data: {
        status: 'CHECKED_IN',
        checkInTime: new Date(),
        checkInPhoto: photoUrl,
      },
    });

    // 4. Create Checkin record for audit/logs
    return this.prisma.checkin.create({
      data: {
        eventId,
        usherId,
        lat: 0, // Should be passed from frontend
        lng: 0,
        distanceKm: 0,
        withinZone: true,
        kind: 'IN',
      },
    });
  }
}
