import * as admin from 'firebase-admin';
import { Twilio } from 'twilio';
import { sendPushNotification, sendWhatsAppMessage, twilio, fcm } from './notifications';

jest.mock('firebase-admin', () => {
  const mockSend = jest.fn();
  return {
    apps: [],
    initializeApp: jest.fn(),
    credential: {
      applicationDefault: jest.fn(),
    },
    messaging: jest.fn().mockReturnValue({
      send: mockSend,
    }),
  };
});

jest.mock('twilio', () => {
  return {
    Twilio: jest.fn().mockImplementation(() => {
      return {
        messages: {
          create: jest.fn(),
        },
      };
    }),
  };
});

describe('Notifications', () => {
  it('should send push notification', async () => {
    (fcm.send as jest.Mock).mockResolvedValue('msg-id');

    const result = await sendPushNotification('token', 'title', 'body');
    expect(result).toBe('msg-id');
    expect(fcm.send).toHaveBeenCalledWith({
      token: 'token',
      notification: { title: 'title', body: 'body' },
    });
  });

  it('should send WhatsApp message', async () => {
    (twilio.messages.create as jest.Mock).mockResolvedValue({ sid: 'sid' });

    const result = await sendWhatsAppMessage('to', 'body');
    expect(result.sid).toBe('sid');
    expect(twilio.messages.create).toHaveBeenCalledWith({
      from: expect.stringContaining('whatsapp:'),
      to: 'whatsapp:to',
      body: 'body',
    });
  });
});
